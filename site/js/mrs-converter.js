import { IpAddress, IpRange } from "cidr-calc";
import { decompress } from "fzstd";

const MAGIC = [77, 82, 83, 1]; // MRS1

export function fromMRS(rawBytes) {
	const r = makeReader(decompress(new Uint8Array(rawBytes)));

	// MAGIC(4)
	if (!MAGIC.every((b, _) => r.u8() === b)) {
		throw new Error("Invalid format!");
	}

	const behavior = r.u8(); // behavior(1)
	r.i64(); // count(8)

	const extraLen = r.i64(); // extraLen(8)
	for (let i = 0; i < extraLen; i++) {
		r.i64(); // extra(8 * len)
	}

	r.u8(); // version(1)

	let parse;
	switch (behavior) {
		case 0:
			parse = parseDomains;
			break;
		case 1:
			r.i64();
			parse = parseIPCIDR;
			break;
		default:
			throw new Error("Invalid behavior!");
	}
	return { behavior: behavior, payload: parse(r) };
}

function parseDomains(r) {
	const leaves = r.u64A();

	const labelBitmap = r.u64A();
	const lbLen = labelBitmap.length;

	const labels = r.bytes(r.i64());
	const labelsChars = Array.from(labels, (c) => String.fromCharCode(c));

	const prefixZeros = new Int32Array(lbLen + 1);
	const onesPos = [];
	for (let i = 0; i < lbLen; i++) {
		const isOne = labelBitmap[i] === "1";
		prefixZeros[i + 1] = prefixZeros[i] + (isOne ? 0 : 1);
		if (isOne) onesPos.push(i);
	}

	const getBitmapStart = (nodeId) =>
		nodeId === 0 ? 0 : onesPos[nodeId - 1] + 1;

	const domains = [];
	const stack = [[0, ""]];
	while (stack.length > 0) {
		const [nodeId, reversedPath] = stack.pop();
		if (leaves[nodeId] === "1") {
			domains.push(reversedPath.split("").reverse().join(""));
		}

		let bitPos = getBitmapStart(nodeId);
		while (bitPos < lbLen && labelBitmap[bitPos] === "0") {
			const char = labelsChars[prefixZeros[bitPos]];
			const childId = prefixZeros[bitPos] + 1;
			stack.push([childId, reversedPath + char]);
			bitPos++;
		}
	}

	const unique = [...new Set(domains)];
	const wildcardBases = new Set();
	for (const d of unique) {
		if (d.startsWith("+.")) wildcardBases.add(d.slice(2));
	}
	return unique.filter((d) => !wildcardBases.has(d));
}

function parseIPCIDR(r) {
	const isIPv4Mapped = (bytes) => {
		const prefix = [...Array(10).fill(0), 255, 255];
		return prefix.every((b, i) => b === bytes[i]);
	};

	const formatAddress = (bytes, isIPv4) => {
		if (isIPv4) {
			return bytes.slice(12).join(".");
		}
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		return Array.from({ length: 8 }, (_, i) =>
			view.getUint16(i * 2, false).toString(16),
		).join(":");
	};

	const cidrs = [];
	while (r.remaining() >= 32) {
		const startBytes = r.bytes(16);
		const endBytes = r.bytes(16);
		const isIPv4 = isIPv4Mapped(startBytes);

		const range = new IpRange(
			IpAddress.of(formatAddress(startBytes, isIPv4)),
			IpAddress.of(formatAddress(endBytes, isIPv4)),
		);
		cidrs.push(range.toCidrs()[0].toString());
	}
	return cidrs;
}

function makeReader(b) {
	let offset = 0;
	const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
	return {
		i64() {
			const v = Number(view.getBigUint64(offset, false));
			offset += 8;
			return v;
		},
		u8() {
			const v = b[offset];
			offset++;
			return v;
		},
		u64() {
			const v = view.getBigUint64(offset, false);
			offset += 8;
			return v;
		},
		u64A() {
			const len = this.i64();
			const array = [];
			for (let i = 0; i < len; i++) array.push(this.u64());
			return array
				.map((v) =>
					v.toString(2).padStart(64, "0").split("").reverse().join(""),
				)
				.join("");
		},
		bytes(len) {
			const v = b.subarray(offset, offset + len);
			offset += len;
			return v;
		},
		remaining() {
			return b.length - offset;
		},
	};
}
