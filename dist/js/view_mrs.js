import { IpRange, IpAddress } from 'https://cdn.jsdelivr.net/npm/cidr-calc@1.0.4/+esm';

function readI64BE(buf, offset) {
    const hi = ((buf[offset]<<24) | (buf[offset+1]<<16) | (buf[offset+2]<<8) | buf[offset+3]) >>> 0;
    const lo = ((buf[offset+4]<<24) | (buf[offset+5]<<16) | (buf[offset+6]<<8) | buf[offset+7]) >>> 0;
    return hi * 0x100000000 + lo;
};
function readU64BigInt(buf, offset) {
  let v = 0n;
  for (let i = 0; i < 8; i++) v = (v << 8n) | BigInt(buf[offset++]);
  return v;
}
function toBin(arr) {
    return arr.map(v => v.toString(2).padStart(64, '0').split('').reverse().join('')).join('');
}

export function viewMRS(dec){
    const behavior = dec[4]
    if (behavior in [0,1]) {
        const rulesLen = readI64BE(dec, 5);         // for future: if the "extra" block starts being used in the mihomo, the logic will need to be changed
        const payloadStart = 4 + 1 + 8 + 8 + 0 + 1; // https://github.com/MetaCubeX/mihomo/blob/Alpha/rules/provider/mrs_reader.go#L50
        let rules;
        let payloadDec;
        switch (behavior){
            case 0:
                payloadDec = dec.slice(payloadStart);
                rules = viewDomain(payloadDec);
                break;
            case 1:
                payloadDec = dec.slice(payloadStart+8);
                rules = viewIPCIDR(payloadDec);
        }
        return { behavior, rules }
    }else {
        alert(`Invalid behavior`);
    }
}

function viewDomain(dec){
    let pos = 0;

    const leavesLen = readI64BE(dec, pos);
    pos += 8;
    const leaves = [];
    for (let i = 0; i < leavesLen; i++) {
        leaves.push(readU64BigInt(dec, pos));
        pos += 8;
    }
    const leavesBin = toBin(leaves);

    const labelBitmapLen = readI64BE(dec, pos);
    pos += 8;
    const labelBitmap = [];
    for (let i = 0; i < labelBitmapLen; i++) {
        labelBitmap.push(readU64BigInt(dec, pos));
        pos += 8;
    }
    const labelBitmapBin = toBin(labelBitmap);

    const labelLen = readI64BE(dec, pos);
    pos += 8;
    const labels = dec.slice(pos, pos + labelLen);
    const labelsChars = Array.from(labels, b => String.fromCharCode(b));
    
    const n = labelBitmapBin.length;
    const prefixZeros = new Int32Array(n + 1);
    const onesPos = [];
    for (let i = 0; i < n; i++) {
        const b = labelBitmapBin[i];
        prefixZeros[i + 1] = prefixZeros[i] + (b === '0' ? 1 : 0);
        if (b === '1') onesPos.push(i);
    }

    const total = labelBitmapBin.length;
    const domains = [];
    const bmStart = (nodeId) =>
        nodeId === 0 ? 0 : onesPos[nodeId - 1] + 1;
    const stack = [[0, '']];
    while (stack.length > 0) {
        const [nodeId, path] = stack.pop();

        if (leavesBin[nodeId] === '1') {
            domains.push(path.split('').reverse().join(''));
        }
        let bm = bmStart(nodeId);
        while (bm < total && labelBitmapBin[bm] === '0') {
            const char = labelsChars[prefixZeros[bm]];
            const childId = prefixZeros[bm] + 1;
            stack.push([childId, path + char]);
            bm++;
        }
    }
    
    const set = new Set(domains);
    const filteredDomains = domains.filter(d => {
        return !set.has('+.' + d);
    });
    return filteredDomains.sort();
}

function viewIPCIDR(dec){
    let result32 = [];

    for (let i = 0; i < dec.length; i += 32) {
        const chunk = dec.slice(i, i + 32);
        result32.push(chunk);
    }
    const result16 = result32.map(chunk32 => {
      const firstHalf = chunk32.slice(0, 16);
      const secondHalf = chunk32.slice(16, 32);
      return [firstHalf, secondHalf];
    });

    const checkIPv4 = [...Array(10).fill(0), 255, 255];
    const preResult = result16.map(chunksOf16 => {
        const isIPv4 = checkIPv4.slice(0, 12).every((b, i) => {
            return b == chunksOf16[0][i];
        });
        const IPs = chunksOf16.map(nums => {
            if (isIPv4){
                const finalNums = nums.slice(12);
                return finalNums.join('.');
            }else{
                nums = [...nums].map(num => num.toString(16));
                let finalNums = [];
                for (let i = 0; i < nums.length; i += 2){
                    const n = nums[i].padStart(2, `0`) + nums[i+1].padStart(2, `0`);
                    finalNums.push(n);
                }
                return finalNums.join(':');
            }
        });
        return IPs;
    });

    const finalResult = preResult.map(rangeIPs => {
        const range = new IpRange(IpAddress.of(rangeIPs[0]), IpAddress.of(rangeIPs[1]));
        const cidrs = range.toCidrs();
        return cidrs[0].toString()
    })
    return finalResult;
}
