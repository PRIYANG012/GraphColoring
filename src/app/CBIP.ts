import { combineLatest } from "rxjs";

export class CBIPAlgo {
    sets: Set<number>[] = [new Set(), new Set()];
    graph: number[][];
    colors: number[] = [];
    visited: boolean[] = [];
    partGraph: Set<number>[] = [];

    constructor(graph: number[][]) {
        this.graph = graph;
    }

    possibleBipartition(V: number, G: number[][]): boolean {
        // To store graph as adjacency list in edges
        const edges: number[][] = Array.from({ length: V + 1 }, () => []);

        for (const [u, v] of G) {
            edges[u].push(v);
            edges[v].push(u);
        }

        const visited: boolean[] = Array.from({ length: V + 1 }, () => false);
        let res = true;

        for (let i = 1; i <= V; i++) {
            if (!visited[i]) {
                res = res && this.bipartite(edges, V, i, visited);
            }
        }

        return res;
    }

    bipartite(edges: number[][], V: number, i: number, visited: boolean[]): boolean {
        if (V === 0) {
            return true;
        }

        const pending: number[] = [];

        // Inserting source vertex in U(set[0])
        this.sets[0].add(i);

        // Enqueue source vertex
        pending.push(i);

        while (pending.length > 0) {
            // Dequeue current vertex
            const current = pending.pop()!;

            // Mark the current vertex true
            visited[current] = true;

            // Finding the set of
            // current vertex(parent vertex)
            const currentSet = this.sets[0].has(current) ? 0 : 1;

            for (const neighbor of edges[current]) {
                // If not present
                // in any of the set
                if (!this.sets[0].has(neighbor) && !this.sets[1].has(neighbor)) {
                    // Inserting in opposite
                    // of current vertex
                    this.sets[1 - currentSet].add(neighbor);
                    pending.push(neighbor);
                } else if (this.sets[currentSet].has(neighbor)) {
                    // Else if present in the same
                    // current vertex set the partition
                    // is not possible
                    return false;
                }
            }
        }

        return true;
    }

    generateSets(vertex: number, size: number, edgeGraph: number[][]): Set<number> {
        this.sets[0] = new Set();
        this.sets[1] = new Set();
        let flag = 1;
        const result: Set<number>[] = [];

        if (this.possibleBipartition(this.partGraph.length, edgeGraph)) {
            const newSet: Set<number> = new Set();

            for (const elem of this.sets[0]) {
                newSet.add(elem - 1);
            }

            result.push(newSet);

            const newSet2: Set<number> = new Set();

            for (const s of this.sets[1]) {
                newSet2.add(s - 1);

                if (s - 1 === vertex) {
                    flag = 0;
                }
            }

            result.push(newSet2);
        }

        return result[flag];
    }

   convert_to_edges(part_graph: Set<number>[]): number[][] {
        const edge_graph: number[][] = [];
        for (let u = 0; u < part_graph.length; u++) {
            for (const v of Array.from(part_graph[u])) {
                if (u <= v) {
                    edge_graph.push([u + 1, v + 1]);
                }
            }
        }
        return edge_graph;
    }

    setup(vertices: number): void {
        this.colors = new Array(vertices);

        for (let i = 0; i < vertices; i++) {
            this.colors[i] = Infinity;
        }
        this.visited = new Array(vertices).fill(false);
    }

    getMinColor(color: Set<number>): number {
        const n = color.size;
        for (let i = 1; i <= n + 1; i++) {
            if (!color.has(i)) {
                return i;
            }
        }
        return -1;
    }

    assignColor(vertex: number, part: Set<number>): void {
        const colors_x = new Set<number>();

        for (const i of Array.from(part)) {
            colors_x.add(this.colors[i]);
        }
        this.colors[vertex] = this.getMinColor(colors_x);
    }

    generatePartialGraph(vertex: number, nbrs: number[]): void {
        this.visited[vertex] = true;
        const hashset = new Set<number>();
        for (const nbr of nbrs) {
            if (this.visited[nbr]) {
                hashset.add(nbr);
                const old = this.partGraph[nbr];
                old.add(vertex);
                this.partGraph[nbr] = old;
            }
        }
        this.partGraph.splice(vertex, 0, hashset);
    }

    total_colours(color: number[]): number {
        let max = 0;
        for (const i of color) {
            if (i > max) {
                max = i;
            }
        }
        return max;
    }

    cbip(vertex: number, nbrs: number[]): void {
        this.generatePartialGraph(vertex, nbrs);
        const edge_graph = this.convert_to_edges(this.partGraph);
        const required_partition = this.generateSets(vertex, this.partGraph.length, edge_graph);
        this.assignColor(vertex, required_partition);
    }

    get_unique_colors(): number {
        return new Set(this.colors).size;
    }

    get_colors(): number[] {

        return this.colors


    }

}