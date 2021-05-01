import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#D1CDC4', '#340352', '#732A70', '#FF6EA7', '#FFE15F'];
    backgroundColor = '#FFFFFF';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height);
        this.canvas = renderer.canvas;
        //s.background(0, 0, 0, 255);
        //s.colorMode(s.HSB);

    }

    protected draw(s) {
        if (this.animating) { 
            this.frameCount += 3;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            //s.colorMode(s.RGB);
            s.background(s.color(61, 0, 153, 255));
            //s.colorMode(s.HSB);

            let numpoints = 100;
            let centerY = s.height / 4;

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < numpoints; j++) {
                    let angle = 2 * Math.PI * j / numpoints;

                    let rx = Math.sin(frameDelta) * 10;

                    let x = j;
                    let y = 30 + Math.cos(angle * 10) * rx;

                    let _a = s.map(x, 0, numpoints, -180, 180);
                    let _r = y + (i * 10);
                    let [_x, _y] = this.getPolar(this.width / 2, this.height / 2, _r, _a);

                    s.circle(_x, _y, 3);
                    
                    //let hue = ((frameDelta + angle) / Math.PI) * 360 % 360; //color rotates
                    //let a = s.color(61, 0, 153, 255);
                    let a = s.color(217, 255, 64, 255);
                    let b = s.color(230, 23, 80, 255);

                    
                    let pct = j / numpoints * 2;
                    if (j > numpoints / 2) {
                        pct = 1 - (j - numpoints / 2) / numpoints * 2;
                    }
                    
                    //pct = ((frameDelta + angle) / Math.PI) % 1;
                    pct = pct + Math.sin(frameDelta);
                    pct = s.map(pct, 0, 1, 0.4, 0.6);
                    let inter = s.lerpColor(a, b, pct);

                    s.fill(inter);
                    s.stroke(inter);

                }
            }

            console.log(frameDelta);
            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        this.s.background(0, 0, 0, 255);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}