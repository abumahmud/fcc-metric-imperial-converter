'use strict';
class ConvertHandler {
    constructor() {
        this.units = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
        // exact FCC conversion constants
        this.GAL_TO_L = 3.78541;
        this.LBS_TO_KG = 0.453592;
        this.MI_TO_KM = 1.60934;
    }
    /**
    * Parse the number portion. Supports:
    * - integer/decimal (e.g., 2, 2.5)
    
    * - simple fraction (3/4)
    * - fraction with decimals (3.2/4.5)
    * - default to 1 when no number is provided
    * Invalid when more than one slash exists or non-numeric parts.
    * Returns null on invalid number.
    */
    getNum(input) {
        const trimmed = String(input).trim();
        // Separate numeric prefix from unit suffix
        const match = trimmed.match(/^\s*([\d.\/]+)?\s*([a-zA-Z]+)\s*$/);
        if (!match) return null; // if input has spaces in the middle or weird chars
        let numPart = match[1];
        if (numPart === undefined || numPart === '' || numPart === null) {
            return 1; // default when absent
        }
        // Validate slashes
        const slashCount = (numPart.match(/\//g) || []).length;
        if (slashCount > 1) return null;
        // Simple number
        if (slashCount === 0) {
            const n = Number(numPart);
            return Number.isFinite(n) ? n : null;
        }
        // One slash => fraction a/b, both sides must be numeric
        const [a, b] = numPart.split('/');
        if (a === '' || b === '') return null;
        const na = Number(a);
        const nb = Number(b);
        if (!Number.isFinite(na) || !Number.isFinite(nb)) return null;
        if (nb === 0) return null; // avoid division by zero
        return na / nb;
    }

    /**
    * Extract and normalize unit. Valid units: gal, L, mi, km, lbs, kg
    * Accepts case-insensitive input but returns canonical casing
    * (notably 'L' is uppercase in canonical form).
    */
    getUnit(input) {
        const trimmed = String(input).trim();
        const match = trimmed.match(/^\s*([\d.\/]+)?\s*([a-zA-Z]+)\s*$/);
        if (!match) return null;
        const unitRaw = match[2];
        if (!unitRaw) return null;
        const lower = unitRaw.toLowerCase();
        switch (lower) {
            case 'gal': return 'gal';
            case 'l': return 'L'; // liters canonical uppercase L
            case 'mi': return 'mi';
            case 'km': return 'km';
            case 'lbs': return 'lbs';
            case 'kg': return 'kg';
            default: return null;
        }
    }
    getReturnUnit(initUnit) {
        switch (initUnit) {
            case 'gal': return 'L';
            case 'L': return 'gal';
            case 'mi': return 'km';
            case 'km': return 'mi';
            case 'lbs': return 'kg';
            case 'kg': return 'lbs';
            default: return null;
        }
    }
    spellOutUnit(unit) {
        switch (unit) {
            case 'gal': return 'gallons';
            case 'L': return 'liters';
            case 'mi': return 'miles';
            case 'km': return 'kilometers';
            case 'lbs': return 'pounds';
            case 'kg': return 'kilograms';
            default: return '';
        }
    }
    /**
    * Perform conversion with 5-decimal rounding as FCC expects.
    */

    convert(initNum, initUnit) {
        let result;
        switch (initUnit) {
            case 'gal':
                result = initNum * this.GAL_TO_L;
                break;
            case 'L':
                result = initNum / this.GAL_TO_L;
                break;
            case 'mi':
                result = initNum * this.MI_TO_KM;
                break;
            case 'km':
                result = initNum / this.MI_TO_KM;
                break;
            case 'lbs':
                result = initNum * this.LBS_TO_KG;
                break;
            case 'kg':
                result = initNum / this.LBS_TO_KG;
                break;
            default:
                return null;
        }
        return Number(parseFloat(result).toFixed(5));
    }

    getString(initNum, initUnit, returnNum, returnUnit) {
        const from = this.spellOutUnit(initUnit);
        const to = this.spellOutUnit(returnUnit);
        return `${initNum} ${from} converts to ${returnNum} ${to}`;
    }
}
module.exports = ConvertHandler;