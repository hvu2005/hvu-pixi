

const OS = 2147483647;

export class SeededRandom {
    
    static random = new SeededRandom(123456789);

    constructor(seed = 123456789) {
        // seed cố định
        this.seed = seed % OS;
        if (this.seed <= 0) this.seed += OS;
    }

    // Sinh số nguyên mới
    next() {
        this.seed = (this.seed * 16807) % OS;
        return this.seed;
    }

    // Sinh số float [0, 1)
    nextFloat() {
        return (this.next() - 1) / OS;
    }

    // Sinh số trong khoảng [min, max)
    range(min, max) {
        return min + this.nextFloat() * (max - min);
    }

    // Sinh số nguyên trong khoảng [min, max]
    rangeInt(min, max) {
        return Math.floor(this.range(min, max + 1));
    }
}

