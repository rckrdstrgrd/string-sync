import { Line, Measure, Note } from './';
import { VextabParser } from './parser';
import { last } from 'lodash';
import { isBetween } from 'ssUtil';
import { Flow } from 'vexflow';

const { Fraction } = Flow;

class Tab {
  measures: Array<Measure> = [];
  lines: Array<Line> = [];
  vextabString: string = '';
  parser: VextabParser = null;
  measuresPerLine: number = 0;
  error: string = null;
  width: number = 0;

  constructor(vextabString: string, width: number) {
    this.vextabString = vextabString;
    this.width = width;

    this._setup();
  }

  select(line?: number, measure?: number, note?: number): Line | Measure | Note {
    const l = typeof line === 'number';
    const m = typeof measure === 'number';
    const n = typeof note === 'number';

    let result = null;
    let _line = this.lines[line];

    if (l && m && n) {
      const _measure = _line.select(measure) as Measure;
      result = _measure.select(note);
    } else if (l && m) {
      result = _line.select(measure);
    } else if (l) {
      result = _line;
    }

    return result || null;
  }

  hydrateNotes(): void {
    this._setNoteTickStarts();
    this._setNoteTickStops();
  }

  updateNoteColors(prevNote: Note, currNote: Note): Tab {
    if (prevNote) {
      prevNote.renderer.setStyle('DEFAULT').redraw();
    }

    if (currNote) {
      currNote.renderer.setStyle('ACTIVE').redraw();
    }

    return this;
  }

  private _setup(): boolean {
    this.error = null;
    this.measuresPerLine = this._getMeasuresPerLine(this.width);

    try {
      this.parser = new VextabParser(this.vextabString);
      const parsed = this.parser.parse();
      const chunks = this.parser.chunk();
      this._createMeasures(chunks);
      this._createLines();
      return true;
    } catch (error) {
      this.error = error.message;
      return false;
    }
  }

  private _createLines(): Array<Line> {
    const lines = this._getMeasureGroups().map((measureGroup, lineNumber) =>
      new Line(measureGroup, lineNumber, this.width, this.measuresPerLine)
    );

    lines.forEach((line, ndx) => {
      const prev = lines[ndx - 1] || null;
      line.setPrev(prev);
    });

    return this.lines = lines;
  }

  private _getMeasuresPerLine(width: number): number {
    switch (true) {
      case width <= 646:
        return 1;
      case isBetween(width, 646, 768):
        return 2;
      case isBetween(width, 768, 992):
        return 3;
      case isBetween(width, 992, 1200):
        return 4;
      case isBetween(width, 1200, 1680):
        return 5;
      default:
        return Math.ceil(width / 336);
    }
  }

  private _createMeasures(chunks: Array<Vextab.Chunk>): Array<Measure> {
    this.measures = [];

    chunks.forEach(chunk => {
      chunk.vextabStringMeasures.forEach((vextabStringMeasure, ndx) => {
        const measure = new Measure({
          vextabString: vextabStringMeasure,
          vextabOptions: chunk.vextabOptionsString,
          vextabOptionsId: chunk.vextabOptionsId,
          number: this.measures.length + 1
        });

        const prev = last(this.measures) || null;
        measure.setPrev(prev);

        this.measures.push(measure);
      });
    });

    return this.measures;
  }

  private _getMeasureGroups(): Array<Array<Measure>> {
    const measureGroups = [];

    this.measures.forEach(measure => {
      const shouldCreateNewGroup = (
        measureGroups.length === 0 ||
        last(measureGroups).length === this.measuresPerLine ||
        (
          last(measureGroups).length > 0 &&
          last(last(measureGroups)).vextabOptionsId !== measure.vextabOptionsId
        )
      );

      if (shouldCreateNewGroup) {
        measureGroups.push([]);
      }

      last(measureGroups).push(measure);
    });

    return measureGroups;
  }

  private _setNoteTickStarts(): Tab {
    const totalTicks = new Fraction(0, 1);

    this.lines.forEach(line => {
      const maxTick = new Fraction(0, 1);

      line.measures.forEach(measure => {
        const totalMeasureTicks = new Fraction(0, 1);

        measure.notes.forEach(note => {
          const absTick = totalTicks.clone();
          note.tickRange.start = absTick.add(totalMeasureTicks).simplify().value();

          if (note.getType() === 'note') {
            const noteTicks = note.getTicks();
            totalMeasureTicks.add(noteTicks.numerator, noteTicks.denominator);
          }
        });

        if (totalMeasureTicks.value() > maxTick.value()) {
          maxTick.copy(totalMeasureTicks);
        }

        totalTicks.add(maxTick);
      });
    });

    return this;
  }

  private _setNoteTickStops(): Tab {
    this.lines.forEach(line => {
      line.measures.forEach(measure => {
        measure.notes.forEach(note => {
          if (note.next) {
            note.tickRange.stop = note.next.tickRange.start;
          }
        });
      });
    });

    const lastNote = last(last(last(this.lines).measures).notes) as Note;

    if (lastNote) {
      lastNote.tickRange.stop = Number.MAX_SAFE_INTEGER;
    }

    return this;
  }
}

export default Tab;
