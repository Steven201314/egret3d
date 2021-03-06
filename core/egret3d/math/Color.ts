namespace egret3d {
    /**
     * 颜色接口。
     */
    export interface IColor {
        /**
         * 红色通道。（0.0 ~ 1.0）
         */
        r: number;
        /**
         * 绿色通道。（0.0 ~ 1.0）
         */
        g: number;
        /**
         * 蓝色通道。（0.0 ~ 1.0）
         */
        b: number;
        /**
         * 透明通道。（0.0 ~ 1.0）
         */
        a: number;
    }
    /**
     * 颜色。
     */
    export class Color extends paper.BaseRelease<Color> implements IColor, paper.ICCS<Color>, paper.ISerializable {
        /**
         * 所有颜色通道均为零的颜色。
         * - 请注意不要修改该值。
         */
        public static readonly ZERO: Readonly<Color> = new Color().set(0.0, 0.0, 0.0, 0.0);
        /**
         * 黑色。
         * - 请注意不要修改该值。
         */
        public static readonly BLACK: Readonly<Color> = new Color().set(0.0, 0.0, 0.0, 1.0);
        /**
         * 灰色。
         * - 请注意不要修改该值。
         */
        public static readonly GRAY: Readonly<Color> = new Color().set(0.5, 0.5, 0.5, 1.0);
        /**
         * 白色。
         * - 请注意不要修改该值。
         */
        public static readonly WHITE: Readonly<Color> = new Color().set(1.0, 1.0, 1.0, 1.0);
        /**
         * 红色。
         * - 请注意不要修改该值。
         */
        public static readonly RED: Readonly<Color> = new Color().set(1.0, 0.0, 0.0, 1.0);
        /**
         * 绿色。
         * - 请注意不要修改该值。
         */
        public static readonly GREEN: Readonly<Color> = new Color().set(0.0, 1.0, 0.0, 1.0);
        /**
         * 蓝色。
         * - 请注意不要修改该值。
         */
        public static readonly BLUE: Readonly<Color> = new Color().set(0.0, 0.0, 1.0, 1.0);
        /**
         * 黄色。
         * - 请注意不要修改该值。
         */
        public static readonly YELLOW: Readonly<Color> = new Color().set(1.0, 1.0, 0.0, 1.0);
        /**
         * 靛蓝色。
         * - 请注意不要修改该值。
         */
        public static readonly INDIGO: Readonly<Color> = new Color().set(0.0, 1.0, 1.0, 1.0);
        /**
         * 紫色。
         * - 请注意不要修改该值。
         */
        public static readonly PURPLE: Readonly<Color> = new Color().set(1.0, 0.0, 1.0, 1.0);

        private static readonly _instances: Color[] = [];
        /**
         * 创建一个新的颜色对象实例
         * @param r 红色通道
         * @param g 绿色通道
         * @param b 蓝色通道
         * @param a 透明通道
         */
        public static create(r: number = 1.0, g: number = 1.0, b: number = 1.0, a: number = 1.0): Color {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!.set(r, g, b, a);
                instance._released = false;
                return instance;
            }

            return new Color().set(r, g, b, a);
        }

        public r: number = 1.0;
        public g: number = 1.0;
        public b: number = 1.0;
        public a: number = 1.0;
        /**
         * 请使用 `egret3d.Color.create()` 创建实例。
         * @see egret3d.Color.create()
         */
        private constructor() {
            super();
        }

        public serialize() {
            return [this.r, this.g, this.b, this.a];
        }

        public deserialize(value: Readonly<[number, number, number, number]>) {
            return this.fromArray(value);
        }

        public clone() {
            return Color.create(this.r, this.g, this.b, this.a);
        }

        public copy(value: Readonly<IColor>) {
            return this.set(value.r, value.g, value.b, value.a);
        }

        public set(r: number, g: number, b: number, a?: number): this {
            this.r = r;
            this.g = g;
            this.b = b;

            if (a !== undefined) {
                this.a = a;
            }

            return this;
        }

        public fromArray(value: ArrayLike<number>, offset: number = 0) {
            this.r = value[0 + offset];
            this.g = value[1 + offset];
            this.b = value[2 + offset];
            this.a = value[3 + offset];

            return this;
        }

        public fromHex(hex: uint): this {
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;

            return this;
        }

        // public fromHSL(h: number, s: number, l: number): this {
        //     // h,s,l ranges are in 0.0 - 1.0
        //     h = _Math.euclideanModulo(h, 1);
        //     s = floatClamp(s, 0, 1);
        //     l = floatClamp(l, 0, 1);

        //     if (s === 0) {

        //         this.r = this.g = this.b = l;

        //     } else {

        //         var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
        //         var q = (2 * l) - p;

        //         this.r = hue2rgb(q, p, h + 1 / 3);
        //         this.g = hue2rgb(q, p, h);
        //         this.b = hue2rgb(q, p, h - 1 / 3);

        //     }

        //     return this;
        // }

        public multiply(valueA: Readonly<IColor>, valueB?: Readonly<IColor>): this {
            if (!valueB) {
                valueB = valueA;
            }
            valueA = this;

            this.r = valueA.r * valueB.r;
            this.g = valueA.g * valueB.g;
            this.b = valueA.b * valueB.b;
            this.a = valueA.a * valueB.a;

            return this;
        }

        public scale(value: number, source?: Readonly<IColor>): this {
            if (!source) {
                source = this;
            }

            this.r = source.r * value;
            this.g = source.g * value;
            this.b = source.b * value;
            this.a = source.a * value;

            return this;
        }

        public lerp(t: number, valueA: Readonly<IColor>, valueB?: Readonly<IColor>): this {
            if (!valueB) {
                valueB = valueA;
                valueA = this;
            }

            this.r = t * (valueB.r - valueA.r) + valueA.r;
            this.g = t * (valueB.g - valueA.g) + valueA.g;
            this.b = t * (valueB.b - valueA.b) + valueA.b;
            this.a = t * (valueB.a - valueA.a) + valueA.a;

            return this;
        }
    }
}