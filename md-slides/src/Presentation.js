import ReactMarkdown from 'react-markdown';
class Slide {
    constructor() {
        this.inner = [];
    }
}

class Parser {
    constructor() {
        this._currentContent = "";
        this.slides = [];
    }

    static getArgs(line) {
        return line.substring(line.indexOf('(') + 1, line.indexOf(')'));
    }

    _evalCommand(line) {
        let argIndex = line.indexOf('(');
        let commandEnd = (argIndex == -1) ? line.length : argIndex;
        let command = line.substring(1, commandEnd).trim();
        let valid = !(this._currentSlide === null);
        switch (command) {
            case "start-slide":
                this._currentSlide = new Slide();
                this._currentContent = "";
                break;
            case "end-slide":
                if (valid) {
                    this._currentSlide.inner.push(<ReactMarkdown>{this._currentContent}</ReactMarkdown>);
                    this.slides.push(this._currentSlide);
                    this._currentContent = "";
                    this._currentSlide = null;
                }
                break;
            case "next-content-block":
                if (valid) {
                    this._currentSlide.inner.push(<ReactMarkdown>{this._currentContent}</ReactMarkdown>);
                    this._currentContent = "";
                }
                break;
        }
    }

    parse(md) {
        this._lines = md.split('\n');
        for (let i = 0; i < this._lines.length; i++) {
            let line = this._lines[i];
            if (line[0] == '@') {
                if (line[1] == '@') {
                    this._currentContent += `${line.substring(1, line.length)}\n`;
                }
                else {
                    this._evalCommand(line);
                }
            }
            else {
                this._currentContent += `${line}\n`;
            }
        }
    }
}

class PresentationData {
    constructor() {
        this.slides = [];
    }

    generateSlides(md) {
        let p = new Parser;
        p.parse(md);
        this.slides = p.slides;
    }
}

export function Presentation(data) {
    let p = new PresentationData();
    p.generateSlides(data);
    return p;
}
