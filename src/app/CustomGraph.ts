import { CustomEdge } from './CustomEdge';
import { CustomVertex } from './CustomVertex';

export class Graph {
    private vertices: Array<CustomVertex>;
    private edges: Array<CustomEdge>;
    private actualColorable: number;
    private observedColorable!: number;
    private adjList: Map<string, Array<CustomEdge>>;

    constructor(actualColorable: number) {
        this.actualColorable = actualColorable;
        this.vertices = new Array<CustomVertex>();
        this.edges = new Array<CustomEdge>();
        this.adjList = new Map<string, Array<CustomEdge>>();
    }

    public getVertices(): Array<CustomVertex> {
        return this.vertices;
    }

    public setVertices(vertices: Array<CustomVertex>): void {
        this.vertices = vertices;
    }

    public getEdges(): Array<CustomEdge> {
        return this.edges;
    }

    public setEdges(edges: Array<CustomEdge>): void {
        this.edges = edges;
    }

    public getActualColorable(): number {
        return this.actualColorable;
    }

    public setActualColorable(actualColorable: number): void {
        this.actualColorable = actualColorable;
    }

    public getObservedColorable(): number {
        return this.observedColorable;
    }

    public setObservedColorable(observedColorable: number): void {
        this.observedColorable = observedColorable;
    }

    public getAdjList(): Map<string, Array<CustomEdge>> {
        return this.adjList;
    }

    public setAdjList(adjList: Map<string, Array<CustomEdge>>): void {
        this.adjList = adjList;
    }

    public addEdge(e: CustomEdge): void {
        this.edges.push(e);
        e.getStart().getIncidents().push(e);
        e.getEnd().getIncidents().push(e);
        e.getStart().getAdjacents().push(e.getEnd());
        e.getEnd().getAdjacents().push(e.getStart());
        this.adjList.set(e.getStart().getName(), e.getStart().getIncidents());
        this.adjList.set(e.getEnd().getName(), e.getEnd().getIncidents());
        // console.log("After");
        // this.printGraph();
    }

    public removeEdge(e: CustomEdge): void {
        this.edges.splice(this.edges.indexOf(e), 1);
    }

    public addVertex(v: CustomVertex): void {
        this.vertices.push(v);
        this.adjList.set(v.getName(), v.getIncidents());
    }

    public removeVertex(v: CustomVertex): void {
        let v1: CustomVertex | null = null;
        for (const e of v.getIncidents()) {
            if (e.getStart() === v) {
                v1 = e.getEnd();
            }
            if (e.getEnd() === v) {
                v1 = e.getStart();
            }
            v1?.getIncidents().splice(v1.getIncidents().indexOf(e), 1);
        }
        this.vertices.splice(this.vertices.indexOf(v));
    }

    public printGraph(): void {
        for (const [key, value] of this.adjList.entries()) {
            let res = `${key}: `;
            for (const e of value) {
                const s = e
                    .getEdgeName()
                    .replace(/-/g, '')
                    .replace(new RegExp(key, 'g'), '')
                    .trim();
                res += `${s} `;
            }
            res = res.substring(0, res.lastIndexOf(' '));
            console.log(res);
        }
    }

    public containsVertex(v: CustomVertex): boolean {
        for (const v1 of this.vertices) {
            if (v1.getName() === v.getName()) {
                return true;
            }
        }
        return false;
    }

    public containsVertexName(v: string): boolean {
        for (const v1 of this.vertices) {
            if (v1.getName() === v) {
                return true;
            }
        }
        return false;
    }

    public containsEdge(e: CustomEdge): boolean {
        for (let e1 of this.edges) {
            if (
                e1.getEdgeName() ===
                `${e.getStart().getName()}-${e.getEnd().getName()}` ||
                e1.getEdgeName() === `${e.getEnd().getName()}-${e.getStart().getName()}`
            ) {
                return true;
            }
        }
        return false;
    }

    public containsEdgeName(start: string, end: string): boolean {
        for (let e1 of this.edges) {
            if (
                e1.getEdgeName() === `${start}-${end}` ||
                e1.getEdgeName() === `${end}-${start}`
            ) {
                return true;
            }
        }
        return false;
    }

    public getVertex(s: string): CustomVertex | null {
        for (const v1 of this.vertices) {
            if (v1.getName() === s) {
                return v1;
            }
        }
        return null;
    }

    public printVertexColors(): void {
        console.log('Vertex : Color');
        for (const v of this.vertices) {
            console.log(v.getName() + ' : ' + v.getColor());
        }
    }

    public getAdjacencyMatrix(): number[][] {
        const n = this.getVertices().length;
        const adjMatrix: number[][] = [];
        for (let i = 0; i < n; i++) {
            adjMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                if (this.containsEdgeName(String(i), String(j))) {
                    adjMatrix[i][j] = 1;
                } else {
                    adjMatrix[i][j] = 0;
                }
            }
        }
        let res = '';
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                res += adjMatrix[i][j] + ',';
            }
            res = res.substring(0, res.lastIndexOf(','));
            res += '\n';
        }
        console.log(res);
        return adjMatrix;
    }

    public FirstFitAlgo(v: CustomVertex): void {
        if (v.getIncidents().length === 0) {
            v.setColor(1);
            return;
        }

        const neighboursC = new Set<number>();
        for (const u of v.getAdjacents()) {
            neighboursC.add(u.getColor());
        }

        v.setColor(this.findFit(neighboursC));
    }


    
    private isSafeVertex(v: CustomVertex, vSet: Set<CustomVertex>): boolean {
        for (const u of vSet) {
            if (u.getAdjacents().includes(v)) {
                return false;
            }
        }
        return true;
    }

    private findFit(set: Set<number>): number {
        let i = 1;
        for (let j of set) {
            if (set.has(i)) {
                i++;
            } else {
                return i;
            }
        }
        return i;
    }

    private static printHashSet(vSet: Set<CustomVertex>): void {
        console.log('++++++++++++');
        for (let u of vSet) {
            console.log(u.getName() + ',');
        }
        console.log();
    }

    private static getColorSet(vSet2: Set<CustomVertex>): Set<number> {
        let otherSetColors = new Set<number>();
        for (let u of vSet2) {
            otherSetColors.add(u.getColor());
        }
        return otherSetColors;
    }
}
