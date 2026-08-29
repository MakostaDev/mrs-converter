var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/cidr-calc/lib/byte-array-utils.js
var require_byte_array_utils = __commonJS({
  "node_modules/cidr-calc/lib/byte-array-utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ByteArrayUtils = void 0;
    var ByteArrayUtils = (
      /** @class */
      (function() {
        function ByteArrayUtils2() {
        }
        ByteArrayUtils2.plusOne = function(bytes) {
          var result = bytes.slice(0);
          for (var i = result.length - 1; i >= 0; --i) {
            ++result[i];
            if (result[i] <= 255) {
              break;
            } else {
              result[i] = 0;
            }
          }
          return result;
        };
        ByteArrayUtils2.minusOne = function(bytes) {
          var result = bytes.slice(0);
          for (var i = result.length - 1; i >= 0; --i) {
            if (result[i] > 0) {
              --result[i];
              break;
            } else {
              result[i] = 255;
            }
          }
          return result;
        };
        ByteArrayUtils2.compare = function(bytes1, bytes2) {
          var byteCount = this.validateSameSizeAndGetSize(bytes1, bytes2);
          for (var i = 0; i < byteCount; ++i) {
            if (bytes1[i] > bytes2[i]) {
              return 1;
            } else if (bytes1[i] < bytes2[i]) {
              return -1;
            }
          }
          return 0;
        };
        ByteArrayUtils2.validateSameSizeAndGetSize = function(bytes1, bytes2) {
          if (bytes2.length !== bytes1.length) {
            throw new Error("Byte arrays need to have the same size");
          }
          return bytes1.length;
        };
        ByteArrayUtils2.validate = function(bytes, byteCount) {
          if (!bytes || bytes.length !== byteCount || !bytes.every(function(b) {
            return (b & 4294967040) === 0;
          })) {
            throw new Error("Invalid byte array");
          }
        };
        ByteArrayUtils2.bytePairToHex = function(b1, b2) {
          return ((b1 & 255) << 8 | b2 & 255).toString(16);
        };
        ByteArrayUtils2.createMasks = function(byteCount, prefixLen) {
          var masks = new Array(byteCount);
          var lastByteIndex = prefixLen >> 3;
          for (var i = 0; i < byteCount; ++i) {
            if (i < lastByteIndex) {
              masks[i] = 255;
            } else if (i === lastByteIndex) {
              masks[i] = 65280 >> (prefixLen & 7) & 255;
            } else {
              masks[i] = 0;
            }
          }
          return masks;
        };
        ByteArrayUtils2.findPrefixLengthOfMaxStartingCidr = function(startIpBytes, endIpBytes) {
          var bitCount = this.validateSameSizeAndGetSize(startIpBytes, endIpBytes) * 8;
          var addrHostBits = this.numberOfTrailingZeros(startIpBytes);
          var hostBitsMaxAllowed = bitCount - this.numberOfLeadingEq(startIpBytes, endIpBytes);
          if (this.numberOfTrailingOnes(endIpBytes) < hostBitsMaxAllowed) {
            --hostBitsMaxAllowed;
          }
          return bitCount - Math.min(addrHostBits, hostBitsMaxAllowed);
        };
        ByteArrayUtils2.numberOfLeadingEq = function(bytes1, bytes2) {
          var byteCount = this.validateSameSizeAndGetSize(bytes1, bytes2);
          var totalCount = 0;
          for (var i = 0; i < byteCount; ++i) {
            var xorResult = bytes1[i] ^ bytes2[i];
            var count = this.numberOfLeadingZerosInByte(xorResult);
            totalCount += count;
            if (count < 8) {
              break;
            }
          }
          return totalCount;
        };
        ByteArrayUtils2.numberOfTrailingZeros = function(bytes) {
          var totalCount = 0;
          for (var i = bytes.length - 1; i >= 0; --i) {
            var count = this.numberOfTrailingZerosInByte(bytes[i]);
            totalCount += count;
            if (count < 8) {
              break;
            }
          }
          return totalCount;
        };
        ByteArrayUtils2.numberOfTrailingOnes = function(bytes) {
          var totalCount = 0;
          for (var i = bytes.length - 1; i >= 0; --i) {
            var count = this.numberOfTrailingZerosInByte(~bytes[i] & 255);
            totalCount += count;
            if (count < 8) {
              break;
            }
          }
          return totalCount;
        };
        ByteArrayUtils2.numberOfLeadingZerosInByte = function(b) {
          if (b === 0) {
            return 8;
          }
          var n = 1;
          if (b >> 4 === 0) {
            n += 4;
            b <<= 4;
          }
          if (b >> 6 === 0) {
            n += 2;
            b <<= 2;
          }
          n -= b >> 7;
          return n;
        };
        ByteArrayUtils2.numberOfTrailingZerosInByte = function(b) {
          if (b === 0) {
            return 8;
          }
          var n = 7;
          var y;
          y = b << 4 & 255;
          if (y !== 0) {
            n -= 4;
            b = y;
          }
          y = b << 2 & 255;
          if (y !== 0) {
            n -= 2;
            b = y;
          }
          return n - ((b << 1 & 255) >> 7);
        };
        return ByteArrayUtils2;
      })()
    );
    exports.ByteArrayUtils = ByteArrayUtils;
  }
});

// node_modules/cidr-calc/lib/ip-notation-utils.js
var require_ip_notation_utils = __commonJS({
  "node_modules/cidr-calc/lib/ip-notation-utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IpNotationUtils = exports.IPV6_BYTE_COUNT = exports.IPV6_PART_COUNT = exports.IPV4_BYTE_COUNT = exports.IPV4_PART_COUNT = void 0;
    var byte_array_utils_1 = require_byte_array_utils();
    exports.IPV4_PART_COUNT = 4;
    exports.IPV4_BYTE_COUNT = 4;
    exports.IPV6_PART_COUNT = 8;
    exports.IPV6_BYTE_COUNT = 16;
    var IpNotationUtils = (
      /** @class */
      (function() {
        function IpNotationUtils2() {
        }
        IpNotationUtils2.regularNotationV4 = function(bytes) {
          byte_array_utils_1.ByteArrayUtils.validate(bytes, exports.IPV4_BYTE_COUNT);
          return bytes.join(".");
        };
        IpNotationUtils2.shortNotationV4 = function(bytes) {
          return this.regularNotationV4(bytes);
        };
        IpNotationUtils2.fullNotationV4 = function(bytes) {
          var _this = this;
          byte_array_utils_1.ByteArrayUtils.validate(bytes, exports.IPV4_BYTE_COUNT);
          return bytes.map(function(b) {
            return _this.padLeft(b.toString(), 3);
          }).join(".");
        };
        IpNotationUtils2.regularNotationV6 = function(bytes) {
          byte_array_utils_1.ByteArrayUtils.validate(bytes, exports.IPV6_BYTE_COUNT);
          var strParts = new Array(exports.IPV6_PART_COUNT);
          for (var i = 0; i < exports.IPV6_PART_COUNT; ++i) {
            strParts[i] = byte_array_utils_1.ByteArrayUtils.bytePairToHex(bytes[i * 2], bytes[i * 2 + 1]);
          }
          return strParts.join(":");
        };
        IpNotationUtils2.shortNotationV6 = function(bytes) {
          var regularNotation = this.regularNotationV6(bytes);
          var maxZeroSeqStart = -1;
          var maxZeroSeqLen = 0;
          var zeroSeqRe = /(^|:)0(:0)+($|:)/g;
          var m;
          while ((m = zeroSeqRe.exec(regularNotation)) !== null) {
            if (maxZeroSeqStart < 0 || m[0].length >> 1 > maxZeroSeqLen >> 1) {
              maxZeroSeqStart = m.index;
              maxZeroSeqLen = m[0].length;
            }
          }
          return maxZeroSeqStart < 0 ? regularNotation : regularNotation.substr(0, maxZeroSeqStart) + "::" + regularNotation.substr(maxZeroSeqStart + maxZeroSeqLen);
        };
        IpNotationUtils2.fullNotationV6 = function(bytes) {
          byte_array_utils_1.ByteArrayUtils.validate(bytes, exports.IPV6_BYTE_COUNT);
          var strParts = new Array(exports.IPV6_PART_COUNT);
          for (var i = 0; i < exports.IPV6_PART_COUNT; ++i) {
            strParts[i] = this.padLeft(byte_array_utils_1.ByteArrayUtils.bytePairToHex(bytes[i * 2], bytes[i * 2 + 1]), 4);
          }
          return strParts.join(":");
        };
        IpNotationUtils2.padLeft = function(s, size) {
          return s.length >= size ? s : "0".repeat(size - s.length) + s;
        };
        return IpNotationUtils2;
      })()
    );
    exports.IpNotationUtils = IpNotationUtils;
  }
});

// node_modules/cidr-calc/lib/index.js
var require_lib = __commonJS({
  "node_modules/cidr-calc/lib/index.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IpRange = exports.Cidr = exports.Ipv6Address = exports.Ipv4Address = exports.IpAddress = void 0;
    var byte_array_utils_1 = require_byte_array_utils();
    var ip_notation_utils_1 = require_ip_notation_utils();
    var IpAddress2 = (
      /** @class */
      (function() {
        function IpAddress3(bytes) {
          this.bytes = bytes.slice(0);
        }
        IpAddress3.of = function(ip) {
          return IpParseUtils.fromString(ip);
        };
        IpAddress3.fromByteArray = function(bytes) {
          return IpParseUtils.fromByteArray(bytes);
        };
        IpAddress3.prototype.toByteArray = function() {
          return this.bytes.slice(0);
        };
        IpAddress3.prototype.next = function() {
          return IpAddress3.fromByteArray(byte_array_utils_1.ByteArrayUtils.plusOne(this.toByteArray()));
        };
        IpAddress3.prototype.prev = function() {
          return IpAddress3.fromByteArray(byte_array_utils_1.ByteArrayUtils.minusOne(this.toByteArray()));
        };
        IpAddress3.prototype.compareTo = function(other) {
          if (this.version() !== other.version()) {
            throw new Error("Only IpAddresses of the same version can be compared");
          }
          return byte_array_utils_1.ByteArrayUtils.compare(this.bytes, other.bytes);
        };
        IpAddress3.prototype.toString = function() {
          return this.shortNotation();
        };
        return IpAddress3;
      })()
    );
    exports.IpAddress = IpAddress2;
    var Ipv4Address = (
      /** @class */
      (function(_super) {
        __extends(Ipv4Address2, _super);
        function Ipv4Address2(bytes) {
          return _super.call(this, bytes) || this;
        }
        Ipv4Address2.prototype.version = function() {
          return "4";
        };
        Ipv4Address2.prototype.regularNotation = function() {
          return ip_notation_utils_1.IpNotationUtils.regularNotationV4(this.bytes);
        };
        Ipv4Address2.prototype.shortNotation = function() {
          return ip_notation_utils_1.IpNotationUtils.shortNotationV4(this.bytes);
        };
        Ipv4Address2.prototype.fullNotation = function() {
          return ip_notation_utils_1.IpNotationUtils.fullNotationV4(this.bytes);
        };
        return Ipv4Address2;
      })(IpAddress2)
    );
    exports.Ipv4Address = Ipv4Address;
    var Ipv6Address = (
      /** @class */
      (function(_super) {
        __extends(Ipv6Address2, _super);
        function Ipv6Address2(bytes) {
          return _super.call(this, bytes) || this;
        }
        Ipv6Address2.prototype.version = function() {
          return "6";
        };
        Ipv6Address2.prototype.regularNotation = function() {
          return ip_notation_utils_1.IpNotationUtils.regularNotationV6(this.bytes);
        };
        Ipv6Address2.prototype.shortNotation = function() {
          return ip_notation_utils_1.IpNotationUtils.shortNotationV6(this.bytes);
        };
        Ipv6Address2.prototype.fullNotation = function() {
          return ip_notation_utils_1.IpNotationUtils.fullNotationV6(this.bytes);
        };
        return Ipv6Address2;
      })(IpAddress2)
    );
    exports.Ipv6Address = Ipv6Address;
    var Cidr = (
      /** @class */
      (function() {
        function Cidr2(prefix, prefixLen) {
          this.checkArgs(prefix, prefixLen);
          this.prefix = prefix;
          this.prefixLen = prefixLen;
        }
        Cidr2.prototype.checkArgs = function(prefix, prefixLen) {
          if (!prefix) {
            throw new Error("prefix is required");
          }
          if (prefixLen === void 0 || prefixLen === null) {
            throw new Error("prefix length is required");
          }
          if (prefix.version() == "ipv4") {
            if (prefixLen < 0 || prefixLen > ip_notation_utils_1.IPV4_BYTE_COUNT * 8) {
              throw new Error("Invalid prefix length for IPv4");
            }
          } else {
            if (prefixLen < 0 || prefixLen > ip_notation_utils_1.IPV6_BYTE_COUNT * 8) {
              throw new Error("Invalid prefix length for IPv6");
            }
          }
        };
        Cidr2.prototype.toString = function() {
          return "".concat(this.prefix, "/").concat(this.prefixLen);
        };
        Cidr2.prototype.toIpRange = function() {
          var startIpBytes = this.prefix.toByteArray();
          var endIpBytes = startIpBytes.slice(0);
          var masks = byte_array_utils_1.ByteArrayUtils.createMasks(startIpBytes.length, this.prefixLen);
          for (var i = 0; i < startIpBytes.length; ++i) {
            startIpBytes[i] = startIpBytes[i] & masks[i];
            endIpBytes[i] = endIpBytes[i] | ~masks[i] & 255;
          }
          return new IpRange2(IpAddress2.fromByteArray(startIpBytes), IpAddress2.fromByteArray(endIpBytes));
        };
        return Cidr2;
      })()
    );
    exports.Cidr = Cidr;
    var IpRange2 = (
      /** @class */
      (function() {
        function IpRange3(startIpAddr, endIpAddr) {
          this.checkArgs(startIpAddr, endIpAddr);
          this.startIpAddr = startIpAddr;
          this.endIpAddr = endIpAddr;
        }
        IpRange3.prototype.checkArgs = function(startIpAddr, endIpAddr) {
          if (!startIpAddr) {
            throw new Error("Start IP address is required");
          }
          if (!endIpAddr) {
            throw new Error("End IP address is required");
          }
          if (startIpAddr.version() !== endIpAddr.version()) {
            throw new Error("Start and end IP addresses must both be IPv4 or IPv6");
          }
          if (startIpAddr.compareTo(endIpAddr) > 0) {
            throw new Error("Start IP address must not be greater than end IP address");
          }
        };
        IpRange3.prototype.toString = function() {
          return "".concat(this.startIpAddr, " - ").concat(this.endIpAddr);
        };
        IpRange3.prototype.toCidrs = function() {
          var cidrs = new Array();
          var startIpBytes = this.startIpAddr.toByteArray();
          var endIpBytes = this.endIpAddr.toByteArray();
          var currIpBytes = startIpBytes;
          while (true) {
            var prefixLen = byte_array_utils_1.ByteArrayUtils.findPrefixLengthOfMaxStartingCidr(currIpBytes, endIpBytes);
            var currCidr = new Cidr(IpAddress2.fromByteArray(currIpBytes), prefixLen);
            cidrs.push(currCidr);
            var lastIpBytes = currCidr.toIpRange().endIpAddr.toByteArray();
            if (byte_array_utils_1.ByteArrayUtils.compare(lastIpBytes, endIpBytes) >= 0) {
              break;
            }
            currIpBytes = byte_array_utils_1.ByteArrayUtils.plusOne(lastIpBytes);
          }
          return cidrs;
        };
        return IpRange3;
      })()
    );
    exports.IpRange = IpRange2;
    var IpParseUtils = (
      /** @class */
      (function() {
        function IpParseUtils2() {
        }
        IpParseUtils2.fromString = function(ipString) {
          return this.fromByteArray(this.ipStringToByteArray(ipString));
        };
        IpParseUtils2.fromByteArray = function(bytes) {
          if (bytes.length === ip_notation_utils_1.IPV4_BYTE_COUNT) {
            byte_array_utils_1.ByteArrayUtils.validate(bytes, ip_notation_utils_1.IPV4_BYTE_COUNT);
            return new Ipv4Address(bytes);
          } else if (bytes.length === ip_notation_utils_1.IPV6_BYTE_COUNT) {
            byte_array_utils_1.ByteArrayUtils.validate(bytes, ip_notation_utils_1.IPV6_BYTE_COUNT);
            return new Ipv6Address(bytes);
          } else {
            throw new Error("invalid byte array length: ".concat(bytes.length));
          }
        };
        IpParseUtils2.ipStringToByteArray = function(ipString) {
          var hasColon = false;
          var hasDot = false;
          for (var i = 0; i < ipString.length; i++) {
            var c = ipString.charAt(i);
            if (c === ".") {
              hasDot = true;
            } else if (c === ":") {
              if (hasDot) {
                throw new Error("Colons must not appear after dots");
              }
              hasColon = true;
            } else if (!this.isHexDigit(c)) {
              throw new Error("Invalid character found: ".concat(c));
            }
          }
          if (hasColon) {
            if (hasDot) {
              ipString = this.convertDottedQuadToHex(ipString);
            }
            return this.textToNumericFormatV6(ipString);
          } else if (hasDot) {
            return this.textToNumericFormatV4(ipString);
          }
          throw new Error("'".concat(ipString, " is not an IP string literal"));
        };
        IpParseUtils2.convertDottedQuadToHex = function(ipString) {
          var lastColon = ipString.lastIndexOf(":");
          var initialPart = ipString.substring(0, lastColon + 1);
          var dottedQuad = ipString.substring(lastColon + 1);
          var quad = this.textToNumericFormatV4(dottedQuad);
          var penultimate = byte_array_utils_1.ByteArrayUtils.bytePairToHex(quad[0], quad[1]);
          var ultimate = byte_array_utils_1.ByteArrayUtils.bytePairToHex(quad[2], quad[3]);
          return initialPart + penultimate + ":" + ultimate;
        };
        IpParseUtils2.textToNumericFormatV4 = function(ipString) {
          var octets = ipString.split(".");
          if (octets.length !== ip_notation_utils_1.IPV4_PART_COUNT) {
            throw new Error("IPv4 addresses must have exactly 4 octets");
          }
          return octets.map(function(octet) {
            if (octet.length <= 0) {
              throw new Error("Address octets must not be empty");
            }
            if (octet.length > 3) {
              throw new Error("Address octets must contain no more than 3 digits");
            }
            var v = Number(octet);
            if (!Number.isInteger(v)) {
              throw new Error("Address octets must be integer");
            }
            if ((v & 4294967040) !== 0) {
              throw new Error("Address octets must be between 0 and 255");
            }
            return v;
          });
        };
        IpParseUtils2.textToNumericFormatV6 = function(ipString) {
          var parts = ipString.split(":");
          if (parts.length < 3 || parts.length > ip_notation_utils_1.IPV6_PART_COUNT + 1) {
            throw new Error("Invalid number of colons found: ".concat(parts.length - 1));
          }
          var skipIndex = -1;
          for (var i = 1; i < parts.length - 1; ++i) {
            if (parts[i].length === 0) {
              if (skipIndex >= 0) {
                throw new Error("Cannot have more than one ::");
              }
              skipIndex = i;
            }
          }
          var partsHi;
          var partsLo;
          if (skipIndex >= 0) {
            partsHi = skipIndex;
            partsLo = parts.length - skipIndex - 1;
            if (parts[0].length === 0 && --partsHi !== 0) {
              throw new Error("^: found, requires ^::");
            }
            if (parts[parts.length - 1].length === 0 && --partsLo !== 0) {
              throw new Error(":$ found, requires ::$");
            }
          } else {
            partsHi = parts.length;
            partsLo = 0;
          }
          var partsSkipped = ip_notation_utils_1.IPV6_PART_COUNT - (partsHi + partsLo);
          if (!(skipIndex >= 0 ? partsSkipped >= 1 : partsSkipped === 0)) {
            throw new Error("Invalid number of parts found");
          }
          var bytes = new Array(2 * ip_notation_utils_1.IPV6_PART_COUNT);
          bytes.fill(0);
          for (var i = 0; i < partsHi; ++i) {
            this.parseNonEmptyPartIntoByteArray(parts[i], bytes, i * 2);
          }
          for (var i = partsLo; i > 0; --i) {
            this.parseNonEmptyPartIntoByteArray(parts[parts.length - i], bytes, (ip_notation_utils_1.IPV6_PART_COUNT - i) * 2);
          }
          return bytes;
        };
        IpParseUtils2.parseNonEmptyPartIntoByteArray = function(part, bytes, loc) {
          if (part.length <= 0) {
            throw new Error("Unexpected empty address part encountered");
          }
          if (part.length > 4) {
            throw new Error("Address parts must contain no more than 4 digits");
          }
          var v = parseInt(part, 16);
          if ((v & 4294901760) !== 0) {
            throw new Error("Invalid v6 part found: ".concat(part));
          }
          bytes[loc] = v >> 8;
          bytes[loc + 1] = v & 255;
        };
        IpParseUtils2.isHexDigit = function(c) {
          return c >= "0" && c <= "9" || c >= "a" && c <= "f" || c >= "A" && c <= "F";
        };
        return IpParseUtils2;
      })()
    );
  }
});

// site/js/mrs-converter.js
var import_cidr_calc = __toESM(require_lib(), 1);

// node_modules/fzstd/esm/index.mjs
var ab = ArrayBuffer;
var u8 = Uint8Array;
var u16 = Uint16Array;
var i16 = Int16Array;
var i32 = Int32Array;
var slc = function(v, s, e) {
  if (u8.prototype.slice)
    return u8.prototype.slice.call(v, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  var n = new u8(e - s);
  n.set(v.subarray(s, e));
  return n;
};
var fill = function(v, n, s, e) {
  if (u8.prototype.fill)
    return u8.prototype.fill.call(v, n, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  for (; s < e; ++s)
    v[s] = n;
  return v;
};
var cpw = function(v, t, s, e) {
  if (u8.prototype.copyWithin)
    return u8.prototype.copyWithin.call(v, t, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  while (s < e) {
    v[t++] = v[s++];
  }
};
var ec = [
  "invalid zstd data",
  "window size too large (>2046MB)",
  "invalid block type",
  "FSE accuracy too high",
  "match distance too far back",
  "unexpected EOF"
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var rb = function(d, b, n) {
  var i = 0, o = 0;
  for (; i < n; ++i)
    o |= d[b++] << (i << 3);
  return o;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var rzfh = function(dat, w) {
  var n3 = dat[0] | dat[1] << 8 | dat[2] << 16;
  if (n3 == 3126568 && dat[3] == 253) {
    var flg = dat[4];
    var ss = flg >> 5 & 1, cc = flg >> 2 & 1, df = flg & 3, fcf = flg >> 6;
    if (flg & 8)
      err(0);
    var bt = 6 - ss;
    var db = df == 3 ? 4 : df;
    var di = rb(dat, bt, db);
    bt += db;
    var fsb = fcf ? 1 << fcf : ss;
    var fss = rb(dat, bt, fsb) + (fcf == 1 && 256);
    var ws = fss;
    if (!ss) {
      var wb = 1 << 10 + (dat[5] >> 3);
      ws = wb + (wb >> 3) * (dat[5] & 7);
    }
    if (ws > 2145386496)
      err(1);
    var buf = new u8((w == 1 ? fss || ws : w ? 0 : ws) + 12);
    buf[0] = 1, buf[4] = 4, buf[8] = 8;
    return {
      b: bt + fsb,
      y: 0,
      l: 0,
      d: di,
      w: w && w != 1 ? w : buf.subarray(12),
      e: ws,
      o: new i32(buf.buffer, 0, 3),
      u: fss,
      c: cc,
      m: Math.min(131072, ws)
    };
  } else if ((n3 >> 4 | dat[3] << 20) == 25481893) {
    return b4(dat, 4) + 8;
  }
  err(0);
};
var msb = function(val) {
  var bits = 0;
  for (; 1 << bits <= val; ++bits)
    ;
  return bits - 1;
};
var rfse = function(dat, bt, mal) {
  var tpos = (bt << 3) + 4;
  var al = (dat[bt] & 15) + 5;
  if (al > mal)
    err(3);
  var sz = 1 << al;
  var probs = sz, sym = -1, re = -1, i = -1, ht = sz;
  var buf = new ab(512 + (sz << 2));
  var freq = new i16(buf, 0, 256);
  var dstate = new u16(buf, 0, 256);
  var nstate = new u16(buf, 512, sz);
  var bb1 = 512 + (sz << 1);
  var syms = new u8(buf, bb1, sz);
  var nbits = new u8(buf, bb1 + sz);
  while (sym < 255 && probs > 0) {
    var bits = msb(probs + 1);
    var cbt = tpos >> 3;
    var msk = (1 << bits + 1) - 1;
    var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (tpos & 7) & msk;
    var msk1fb = (1 << bits) - 1;
    var msv = msk - probs - 1;
    var sval = val & msk1fb;
    if (sval < msv)
      tpos += bits, val = sval;
    else {
      tpos += bits + 1;
      if (val > msk1fb)
        val -= msv;
    }
    freq[++sym] = --val;
    if (val == -1) {
      probs += val;
      syms[--ht] = sym;
    } else
      probs -= val;
    if (!val) {
      do {
        var rbt = tpos >> 3;
        re = (dat[rbt] | dat[rbt + 1] << 8) >> (tpos & 7) & 3;
        tpos += 2;
        sym += re;
      } while (re == 3);
    }
  }
  if (sym > 255 || probs)
    err(0);
  var sympos = 0;
  var sstep = (sz >> 1) + (sz >> 3) + 3;
  var smask = sz - 1;
  for (var s = 0; s <= sym; ++s) {
    var sf = freq[s];
    if (sf < 1) {
      dstate[s] = -sf;
      continue;
    }
    for (i = 0; i < sf; ++i) {
      syms[sympos] = s;
      do {
        sympos = sympos + sstep & smask;
      } while (sympos >= ht);
    }
  }
  if (sympos)
    err(0);
  for (i = 0; i < sz; ++i) {
    var ns = dstate[syms[i]]++;
    var nb = nbits[i] = al - msb(ns);
    nstate[i] = (ns << nb) - sz;
  }
  return [tpos + 7 >> 3, {
    b: al,
    s: syms,
    n: nbits,
    t: nstate
  }];
};
var rhu = function(dat, bt) {
  var i = 0, wc = -1;
  var buf = new u8(292), hb = dat[bt];
  var hw = buf.subarray(0, 256);
  var rc = buf.subarray(256, 268);
  var ri = new u16(buf.buffer, 268);
  if (hb < 128) {
    var _a = rfse(dat, bt + 1, 6), ebt = _a[0], fdt = _a[1];
    bt += hb;
    var epos = ebt << 3;
    var lb = dat[bt];
    if (!lb)
      err(0);
    var st1 = 0, st2 = 0, btr1 = fdt.b, btr2 = btr1;
    var fpos = (++bt << 3) - 8 + msb(lb);
    for (; ; ) {
      fpos -= btr1;
      if (fpos < epos)
        break;
      var cbt = fpos >> 3;
      st1 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr1) - 1;
      hw[++wc] = fdt.s[st1];
      fpos -= btr2;
      if (fpos < epos)
        break;
      cbt = fpos >> 3;
      st2 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr2) - 1;
      hw[++wc] = fdt.s[st2];
      btr1 = fdt.n[st1];
      st1 = fdt.t[st1];
      btr2 = fdt.n[st2];
      st2 = fdt.t[st2];
    }
    if (++wc > 255)
      err(0);
  } else {
    wc = hb - 127;
    for (; i < wc; i += 2) {
      var byte = dat[++bt];
      hw[i] = byte >> 4;
      hw[i + 1] = byte & 15;
    }
    ++bt;
  }
  var wes = 0;
  for (i = 0; i < wc; ++i) {
    var wt = hw[i];
    if (wt > 11)
      err(0);
    wes += wt && 1 << wt - 1;
  }
  var mb = msb(wes) + 1;
  var ts = 1 << mb;
  var rem = ts - wes;
  if (rem & rem - 1)
    err(0);
  hw[wc++] = msb(rem) + 1;
  for (i = 0; i < wc; ++i) {
    var wt = hw[i];
    ++rc[hw[i] = wt && mb + 1 - wt];
  }
  var hbuf = new u8(ts << 1);
  var syms = hbuf.subarray(0, ts), nb = hbuf.subarray(ts);
  ri[mb] = 0;
  for (i = mb; i > 0; --i) {
    var pv = ri[i];
    fill(nb, i, pv, ri[i - 1] = pv + rc[i] * (1 << mb - i));
  }
  if (ri[0] != ts)
    err(0);
  for (i = 0; i < wc; ++i) {
    var bits = hw[i];
    if (bits) {
      var code = ri[bits];
      fill(syms, i, code, ri[bits] = code + (1 << mb - bits));
    }
  }
  return [bt, {
    n: nb,
    b: mb,
    s: syms
  }];
};
var dllt = rfse(/* @__PURE__ */ new u8([
  81,
  16,
  99,
  140,
  49,
  198,
  24,
  99,
  12,
  33,
  196,
  24,
  99,
  102,
  102,
  134,
  70,
  146,
  4
]), 0, 6)[1];
var dmlt = rfse(/* @__PURE__ */ new u8([
  33,
  20,
  196,
  24,
  99,
  140,
  33,
  132,
  16,
  66,
  8,
  33,
  132,
  16,
  66,
  8,
  33,
  68,
  68,
  68,
  68,
  68,
  68,
  68,
  68,
  36,
  9
]), 0, 6)[1];
var doct = rfse(/* @__PURE__ */ new u8([
  32,
  132,
  16,
  66,
  102,
  70,
  68,
  68,
  68,
  68,
  36,
  73,
  2
]), 0, 5)[1];
var b2bl = function(b, s) {
  var len = b.length, bl = new i32(len);
  for (var i = 0; i < len; ++i) {
    bl[i] = s;
    s += 1 << b[i];
  }
  return bl;
};
var llb = /* @__PURE__ */ new u8((/* @__PURE__ */ new i32([
  0,
  0,
  0,
  0,
  16843009,
  50528770,
  134678020,
  202050057,
  269422093
])).buffer, 0, 36);
var llbl = /* @__PURE__ */ b2bl(llb, 0);
var mlb = /* @__PURE__ */ new u8((/* @__PURE__ */ new i32([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  16843009,
  50528770,
  117769220,
  185207048,
  252579084,
  16
])).buffer, 0, 53);
var mlbl = /* @__PURE__ */ b2bl(mlb, 3);
var dhu = function(dat, out, hu) {
  var len = dat.length, ss = out.length, lb = dat[len - 1], msk = (1 << hu.b) - 1, eb = -hu.b;
  if (!lb)
    err(0);
  var st = 0, btr = hu.b, pos = (len << 3) - 8 + msb(lb) - btr, i = -1;
  for (; pos > eb && i < ss; ) {
    var cbt = pos >> 3;
    var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (pos & 7);
    st = (st << btr | val) & msk;
    out[++i] = hu.s[st];
    pos -= btr = hu.n[st];
  }
  if (pos != eb || i + 1 != ss)
    err(0);
};
var dhu4 = function(dat, out, hu) {
  var bt = 6;
  var ss = out.length, sz1 = ss + 3 >> 2, sz2 = sz1 << 1, sz3 = sz1 + sz2;
  dhu(dat.subarray(bt, bt += dat[0] | dat[1] << 8), out.subarray(0, sz1), hu);
  dhu(dat.subarray(bt, bt += dat[2] | dat[3] << 8), out.subarray(sz1, sz2), hu);
  dhu(dat.subarray(bt, bt += dat[4] | dat[5] << 8), out.subarray(sz2, sz3), hu);
  dhu(dat.subarray(bt), out.subarray(sz3), hu);
};
var rzb = function(dat, st, out) {
  var _a;
  var bt = st.b;
  var b0 = dat[bt], btype = b0 >> 1 & 3;
  st.l = b0 & 1;
  var sz = b0 >> 3 | dat[bt + 1] << 5 | dat[bt + 2] << 13;
  var ebt = (bt += 3) + sz;
  if (btype == 1) {
    if (bt >= dat.length)
      return;
    st.b = bt + 1;
    if (out) {
      fill(out, dat[bt], st.y, st.y += sz);
      return out;
    }
    return fill(new u8(sz), dat[bt]);
  }
  if (ebt > dat.length)
    return;
  if (btype == 0) {
    st.b = ebt;
    if (out) {
      out.set(dat.subarray(bt, ebt), st.y);
      st.y += sz;
      return out;
    }
    return slc(dat, bt, ebt);
  }
  if (btype == 2) {
    var b3 = dat[bt], lbt = b3 & 3, sf = b3 >> 2 & 3;
    var lss = b3 >> 4, lcs = 0, s4 = 0;
    if (lbt < 2) {
      if (sf & 1)
        lss |= dat[++bt] << 4 | (sf & 2 && dat[++bt] << 12);
      else
        lss = b3 >> 3;
    } else {
      s4 = sf;
      if (sf < 2)
        lss |= (dat[++bt] & 63) << 4, lcs = dat[bt] >> 6 | dat[++bt] << 2;
      else if (sf == 2)
        lss |= dat[++bt] << 4 | (dat[++bt] & 3) << 12, lcs = dat[bt] >> 2 | dat[++bt] << 6;
      else
        lss |= dat[++bt] << 4 | (dat[++bt] & 63) << 12, lcs = dat[bt] >> 6 | dat[++bt] << 2 | dat[++bt] << 10;
    }
    ++bt;
    var buf = out ? out.subarray(st.y, st.y + st.m) : new u8(st.m);
    var spl = buf.length - lss;
    if (lbt == 0)
      buf.set(dat.subarray(bt, bt += lss), spl);
    else if (lbt == 1)
      fill(buf, dat[bt++], spl);
    else {
      var hu = st.h;
      if (lbt == 2) {
        var hud = rhu(dat, bt);
        lcs += bt - (bt = hud[0]);
        st.h = hu = hud[1];
      } else if (!hu)
        err(0);
      (s4 ? dhu4 : dhu)(dat.subarray(bt, bt += lcs), buf.subarray(spl), hu);
    }
    var ns = dat[bt++];
    if (ns) {
      if (ns == 255)
        ns = (dat[bt++] | dat[bt++] << 8) + 32512;
      else if (ns > 127)
        ns = ns - 128 << 8 | dat[bt++];
      var scm = dat[bt++];
      if (scm & 3)
        err(0);
      var dts = [dmlt, doct, dllt];
      for (var i = 2; i > -1; --i) {
        var md = scm >> (i << 1) + 2 & 3;
        if (md == 1) {
          var rbuf = new u8([0, 0, dat[bt++]]);
          dts[i] = {
            s: rbuf.subarray(2, 3),
            n: rbuf.subarray(0, 1),
            t: new u16(rbuf.buffer, 0, 1),
            b: 0
          };
        } else if (md == 2) {
          _a = rfse(dat, bt, 9 - (i & 1)), bt = _a[0], dts[i] = _a[1];
        } else if (md == 3) {
          if (!st.t)
            err(0);
          dts[i] = st.t[i];
        }
      }
      var _b = st.t = dts, mlt = _b[0], oct = _b[1], llt = _b[2];
      var lb = dat[ebt - 1];
      if (!lb)
        err(0);
      var spos = (ebt << 3) - 8 + msb(lb) - llt.b, cbt = spos >> 3, oubt = 0;
      var lst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << llt.b) - 1;
      cbt = (spos -= oct.b) >> 3;
      var ost = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << oct.b) - 1;
      cbt = (spos -= mlt.b) >> 3;
      var mst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mlt.b) - 1;
      for (++ns; --ns; ) {
        var llc = llt.s[lst];
        var lbtr = llt.n[lst];
        var mlc = mlt.s[mst];
        var mbtr = mlt.n[mst];
        var ofc = oct.s[ost];
        var obtr = oct.n[ost];
        cbt = (spos -= ofc) >> 3;
        var ofp = 1 << ofc;
        var off = ofp + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16 | dat[cbt + 3] << 24) >>> (spos & 7) & ofp - 1);
        cbt = (spos -= mlb[mlc]) >> 3;
        var ml = mlbl[mlc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << mlb[mlc]) - 1);
        cbt = (spos -= llb[llc]) >> 3;
        var ll = llbl[llc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << llb[llc]) - 1);
        cbt = (spos -= lbtr) >> 3;
        lst = llt.t[lst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << lbtr) - 1);
        cbt = (spos -= mbtr) >> 3;
        mst = mlt.t[mst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mbtr) - 1);
        cbt = (spos -= obtr) >> 3;
        ost = oct.t[ost] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << obtr) - 1);
        if (off > 3) {
          st.o[2] = st.o[1];
          st.o[1] = st.o[0];
          st.o[0] = off -= 3;
        } else {
          var idx = off - (ll != 0);
          if (idx) {
            off = idx == 3 ? st.o[0] - 1 : st.o[idx];
            if (idx > 1)
              st.o[2] = st.o[1];
            st.o[1] = st.o[0];
            st.o[0] = off;
          } else
            off = st.o[0];
        }
        for (var i = 0; i < ll; ++i) {
          buf[oubt + i] = buf[spl + i];
        }
        oubt += ll, spl += ll;
        var stin = oubt - off;
        if (stin < 0) {
          var len = -stin;
          var bs = st.e + stin;
          if (len > ml)
            len = ml;
          for (var i = 0; i < len; ++i) {
            buf[oubt + i] = st.w[bs + i];
          }
          oubt += len, ml -= len, stin = 0;
        }
        for (var i = 0; i < ml; ++i) {
          buf[oubt + i] = buf[stin + i];
        }
        oubt += ml;
      }
      if (oubt != spl) {
        while (spl < buf.length) {
          buf[oubt++] = buf[spl++];
        }
      } else
        oubt = buf.length;
      if (out)
        st.y += oubt;
      else
        buf = slc(buf, 0, oubt);
    } else if (out) {
      st.y += lss;
      if (spl) {
        for (var i = 0; i < lss; ++i) {
          buf[i] = buf[spl + i];
        }
      }
    } else if (spl)
      buf = slc(buf, spl);
    st.b = ebt;
    return buf;
  }
  err(2);
};
var cct = function(bufs, ol) {
  if (bufs.length == 1)
    return bufs[0];
  var buf = new u8(ol);
  for (var i = 0, b = 0; i < bufs.length; ++i) {
    var chk = bufs[i];
    buf.set(chk, b);
    b += chk.length;
  }
  return buf;
};
function decompress(dat, buf) {
  var bufs = [], nb = +!buf;
  var bt = 0, ol = 0;
  for (; dat.length; ) {
    var st = rzfh(dat, nb || buf);
    if (typeof st == "object") {
      if (nb) {
        buf = null;
        if (st.w.length == st.u) {
          bufs.push(buf = st.w);
          ol += st.u;
        }
      } else {
        bufs.push(buf);
        st.e = 0;
      }
      for (; !st.l; ) {
        var blk = rzb(dat, st, buf);
        if (!blk)
          err(5);
        if (buf)
          st.e = st.y;
        else {
          bufs.push(blk);
          ol += blk.length;
          cpw(st.w, 0, blk.length);
          st.w.set(blk, st.w.length - blk.length);
        }
      }
      bt = st.b + st.c * 4;
    } else
      bt = st;
    dat = dat.subarray(bt);
  }
  return cct(bufs, ol);
}

// site/js/mrs-converter.js
var MAGIC = [77, 82, 83, 1];
function fromMRS(rawBytes) {
  const r = makeReader(decompress(new Uint8Array(rawBytes)));
  if (!MAGIC.every((b, _) => r.u8() === b)) {
    throw new Error("Invalid format!");
  }
  const behavior = r.u8();
  r.i64();
  const extraLen = r.i64();
  for (let i = 0; i < extraLen; i++) {
    r.i64();
  }
  r.u8();
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
  return { behavior, payload: parse(r) };
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
  const getBitmapStart = (nodeId) => nodeId === 0 ? 0 : onesPos[nodeId - 1] + 1;
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
  const wildcardBases = /* @__PURE__ */ new Set();
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
    return Array.from(
      { length: 8 },
      (_, i) => view.getUint16(i * 2, false).toString(16)
    ).join(":");
  };
  const cidrs = [];
  while (r.remaining() >= 32) {
    const startBytes = r.bytes(16);
    const endBytes = r.bytes(16);
    const isIPv4 = isIPv4Mapped(startBytes);
    const range = new import_cidr_calc.IpRange(
      import_cidr_calc.IpAddress.of(formatAddress(startBytes, isIPv4)),
      import_cidr_calc.IpAddress.of(formatAddress(endBytes, isIPv4))
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
      return array.map(
        (v) => v.toString(2).padStart(64, "0").split("").reverse().join("")
      ).join("");
    },
    bytes(len) {
      const v = b.subarray(offset, offset + len);
      offset += len;
      return v;
    },
    remaining() {
      return b.length - offset;
    }
  };
}
export {
  fromMRS
};
