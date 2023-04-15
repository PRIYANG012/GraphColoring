import { CustomEdge } from "./CustomEdge";

export class CustomVertex {
    private static Vid: number = 0;
  
    private id: number;
    private name: string;
    private color: number;
    private incidents!: Array<CustomEdge>;
    private adjacents!: Array<CustomVertex>;
  
    constructor(name: string) {
      this.id = ++CustomVertex.Vid;
      this.color = -1;
      this.name = name;
      this.setIncidents(new Array<CustomEdge>());
      this.setAdjacents(new Array<CustomVertex>());
    }
  
    public getId(): number {
      return this.id;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public getColor(): number {
      return this.color;
    }
  
    public setColor(color: number): void {
      this.color = color;
    }
  
    public getIncidents(): Array<CustomEdge> {
      return this.incidents;
    }
  
    public setIncidents(incidents: Array<CustomEdge>): void {
      this.incidents = incidents;
    }
  
    public getAdjacents(): Array<CustomVertex> {
      return this.adjacents;
    }
  
    public setAdjacents(adjacents: Array<CustomVertex>): void {
      this.adjacents = adjacents;
    }
  }
