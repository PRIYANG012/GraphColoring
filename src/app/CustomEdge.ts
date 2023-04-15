import {CustomVertex} from './CustomVertex'
export class CustomEdge{

private static Eid: number = 0;

private id!: number;
private start: CustomVertex;
private end: CustomVertex;
private edgeName: string;

constructor(start: CustomVertex, end: CustomVertex) {
  this.setId(++CustomEdge.Eid);
  this.start = start;
  this.end = end;
  this.edgeName = `${start.getName()}-${end.getName()}`;
}

public getStart(): CustomVertex {
    return this.start;
  }
  
  public setStart(start: CustomVertex): void {
    this.start = start;
  }
  
  public getEnd(): CustomVertex {
    return this.end;
  }
  
  public setEnd(end: CustomVertex): void {
    this.end = end;
  }
  
  public getId(): number {
    return this.id;
  }
  
  public setId(id: number): void {
    this.id = id;
  }
  
  public getEdgeName(): string {
    return this.edgeName;
  }
  
  public getOtherVertex(vName: string): CustomVertex | null {
    let o: CustomVertex | null = null;
    if (this.getStart().getName() === vName) {
      o = this.getEnd();
    } else if (this.getEnd().getName() === vName) {
      o = this.getStart();
    }
    return o;
  }
}