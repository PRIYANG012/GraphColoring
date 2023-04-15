import {
  Component,
  Input,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import {
  ColaForceDirectedSettings,
  DagreSettings,
  Edge,
  Layout,
  Node,
  Orientation,
} from '@swimlane/ngx-graph';
import { GraphsService } from '../services/graphs.service';
import * as shape from 'd3-shape';
import { Graph } from '../CustomGraph';
import { CustomVertex } from '../CustomVertex';
import { CustomEdge } from '../CustomEdge';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from "@angular/forms";
import {CBIPAlgo} from '../CBIP'

export class Vertex {
  id!: string;
  backgroundColor!: string;
  to!: string[];
}
const orientations = [
  Orientation.TOP_TO_BOTTOM,
  Orientation.BOTTOM_TO_TOM,
  Orientation.LEFT_TO_RIGHT,
  Orientation.RIGHT_TO_LEFT
];

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('myModal') myModal: any;


  gloabalgraph:any;
  containerWidth!: number;
  containerHeight!: number;
  selectedOption = 'firstfit';

  ratio:number=0;

  colorsbyalgo:number=0;
  msg:string="k can't be less then 2"
  algos = [
    {
      id: 'firstfit',
      name: 'FirstFit'
    },
    {
      id: 'CBIP',
      name: 'CBIP'
    }
  ];

  initial={
    id: 'firstfit',
    name: 'FirstFit'
  }
  inputForm : FormGroup;
 
  private modalRef: any;
selected: any;


  ngAfterViewInit() {

    setTimeout(() => {
      this.updateGraph();
    }, 1000); // Wait for 1 second before updating the graph
    
    setTimeout(() => {
      this.containerWidth = this.container.nativeElement.offsetWidth;
      this.containerHeight = this.container.nativeElement.offsetHeight;
    });


  }
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  updateGraph() {
    this.layoutSettings.edgePadding = 0;
    this.update$.next(true);
  }
  centerGraph() {
    this.center$.next(true);
  }

  fitGraph() {
    this.zoomToFit$.next(true);
  }

  @Input() vertex: Vertex[] = [];
  maxZoomLevel: number = 8;
  minZoomLevel: number = 0.2;

  curve: any;
  fitContainer: boolean = true;
  autoZoom: boolean = true;
  panOnZoom: boolean = true;
  enableZoom: boolean = true;
  autoCenter: boolean = true;
  showLegend: boolean = false;

  panOffsetX: number = 0;
  panOffsetY: number = 0;
  myMinWidth: number = 350;
  myMinHeight: number = 100;

  backgroundDefault = '#F8F8F8';
  colorSchemes: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  selection: any;
  currentColorScheme = 'horizon';
  layoutSettings: DagreSettings = {
    ranker: 'network-simplex',
    orientation: orientations[Math.floor(Math.random() * 4)],
  };

  prob = 0.5;
  n = 9;
  k = 2;

  graphData = {
    nodes: [] as Node[],
    links: [] as Edge[],
  };


  graphDatavisaul= {
    nodes: [] as Node[],
    links: [] as Edge[],
  };


  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    public graphService: GraphsService,
    
  ) {
    this.inputForm= new FormGroup({
      cromaticNumber: new FormControl(2),
      numberofNodes: new FormControl(10),
      algo: new FormControl('firstfit'),
      Probability: new FormControl(0.5)
      
    });

   

  }

  

  public open(modal: any): void {
    this.modalService.open(modal);
  }
  

  private colorGraph2(graph:any) {

    this.graphDatavisaul.nodes=[]
    this.graphDatavisaul.links=[]

    const cbip = new CBIPAlgo(graph);

    // Setup the instance
    cbip.setup(graph.length);

    this.colorsbyalgo=0;
    let colors=[];
    for (let i = 0; i < this.n; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(color);
    }
    const g = new Graph(2);

    let i = 0;
    const vertexPresent = new Set();
    for (const node of this.graphData.nodes) {


      this.graphDatavisaul.nodes.push(node);

      const source = node.id;
      if(parseInt(node.id) % 100==0){
      console.log(node.id)
        
      }
      let srcVertex;
      if (!g.containsVertexName(source)) {
        srcVertex = new CustomVertex(source);
        g.addVertex(srcVertex);
        vertexPresent.add(source);
      } else {
        srcVertex = g.getVertex(source);
      }

      const incidentslinks: string[] = [];

      for (const link of this.graphData.links) {
        if (link.source === source) {
          if (incidentslinks.includes(link.target)) {
          }
          else {
            incidentslinks.push(link.target);
          }
        }
        else if (link.target === source) {
          if (incidentslinks.includes(link.source)) {
          }
          else {
            incidentslinks.push(link.source);
          }

        }
        else {
          continue;
        }
      }


      for (const link of incidentslinks) {
        let destVertex;

        if (!vertexPresent.has(link)) {
          continue;
        }

        let node2;

        if (!g.containsVertexName(link)) {
          destVertex = new CustomVertex(link);



          node2 = {
            id: destVertex.getId().toString(),
            label: destVertex.getId().toString(),
            data: {
              backgroundColor: '#00FFFF',
            },
            position: {
              x: Math.random() * 21,
              y: Math.random() * 31,
            },
          };

          if (this.graphDatavisaul.nodes.includes(node2)) {
          }
          else {
            this.graphDatavisaul.nodes.push(node2);

          }

          g.addVertex(destVertex);



        }
        else {
          destVertex = g.getVertex(link);
        }

        if (srcVertex !== null && destVertex !== null && !g.containsEdgeName(source, link)) {
          const edge = new CustomEdge(srcVertex, destVertex);
          //	        			System.out.println("Adding Edge "+ edge.getEdgeName());
          g.addEdge(edge);

          const edge2: Edge = {
            source: source,
            target: link,
          };

          const edge3: Edge = {
            source: link,
            target: source,
          };

          if (this.graphDatavisaul.links.includes(edge2) || this.graphDatavisaul.links.includes(edge3) ) {
          }
          else {
            this.graphDatavisaul.links.push(edge2);

          }

        }


      }

      if (srcVertex !== null) {
        cbip.cbip(parseInt(node.id), graph[parseInt(node.id)]);
      }

      this.updateGraph();
    
      const numbers: number[] = cbip.get_colors();

      if (numbers !== undefined) {
        this.graphDatavisaul.nodes[i].data.backgroundColor = colors[numbers[parseInt(node.id)]];
        if(this.colorsbyalgo<numbers[parseInt(node.id)])
          this.colorsbyalgo=numbers[parseInt(node.id)];
      }
      i++;
      
    } 

    this.ratio=this.colorsbyalgo/this.k;


  }




  public ngOnInit(): void {
   
    // 0: 5 7
    // 1: 6 8
    // 2: 3 7
    // 3: 2 8
    // 4: 9
    // 5: 0 6
    // 6: 1 5
    // 7: 0 2
    // 8: 1 3 9
    // 9: 4 8

//     const input = [    [5, 7],
//     [6, 8],
//     [3, 7],
//     [2, 8],
//     [9],
//     [0, 6],
//     [1, 5],
//     [0, 2],
//     [1, 3, 9],
//     [4, 8]
// ];

// const graph: Set<number>[] = [];

// for (let i = 0; i < input.length; i++) {
//   graph[i] = new Set(input[i]);
// }

// this.gloabalgraph=graph
//     this.graphData.nodes=[{id:"0",label:"0",data: {
//       backgroundColor: '#00FFFF',
//     },},{id:"1",label:"1",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"2",label:"2",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"3",label:"3",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"4",label:"4",data: {
//       backgroundColor: '#00FFFF',
//     }}
//     ,{id:"5",label:"5",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"6",label:"6",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"7",label:"7",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"8",label:"8",data: {
//       backgroundColor: '#00FFFF',
//     }},{id:"9",label:"9",data: {
//       backgroundColor: '#00FFFF',
//     }}]

//     this.graphData.links=[{source:"0",target:"5"},{source:"0",target:"7"},{source:"1",target:"6"},
//     {source:"1",target:"8"},{source:"2",target:"3"},{source:"2",target:"7"},{source:"3",target:"2"}
//     ,{source:"3",target:"8"},{source:"4",target:"9"},{source:"5",target:"6"},{source:"8",target:"9"}]
    this.generator2_0(this.n, this.k, this.prob,"firstfit")
    this.colorGraph()
    this.center$.next(true);

    this.ratio=this.colorsbyalgo/this.k;


    // let N=100;

    // let avg=0.0;
    // let sum=0;
    // while(N>0){

    //   this.generator2_0(this.n, this.k, this.prob,"CBIP")
    //   this.center$.next(true);
  
    //   this.ratio=this.colorsbyalgo/this.k;
      
    //   sum=sum+this.ratio;
    //     N--;
    //     if(N%10==0)
    //       console.log(N)
    // }

    // avg=sum/100;

    // console.log(avg)




  }

  private colorGraph() {
    this.graphDatavisaul.nodes=[]
    this.graphDatavisaul.links=[]

    this.colorsbyalgo=0;
    let colors=[];
    for (let i = 0; i < this.n; i++) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(color);
    }
    const g = new Graph(2);

    let i = 0;
    const vertexPresent = new Set();
    for (const node of this.graphData.nodes) {


      this.graphDatavisaul.nodes.push(node);

      const source = node.id;
      if(parseInt(node.id) % 100==0){
      console.log(node.id)
        
      }
      let srcVertex;
      if (!g.containsVertexName(source)) {
        srcVertex = new CustomVertex(source);
        g.addVertex(srcVertex);
        vertexPresent.add(source);
      } else {
        srcVertex = g.getVertex(source);
      }

      const incidentslinks: string[] = [];

      for (const link of this.graphData.links) {
        if (link.source === source) {
          if (incidentslinks.includes(link.target)) {
          }
          else {
            incidentslinks.push(link.target);
          }
        }
        else if (link.target === source) {
          if (incidentslinks.includes(link.source)) {
          }
          else {
            incidentslinks.push(link.source);
          }

        }
        else {
          continue;
        }
      }


      // console.log("incident edges for " + source + " is " + incidentslinks);

      for (const link of incidentslinks) {
        let destVertex;

        if (!vertexPresent.has(link)) {
          continue;
        }

        let node2;

        if (!g.containsVertexName(link)) {
          destVertex = new CustomVertex(link);



          node2 = {
            id: destVertex.getId().toString(),
            label: destVertex.getId().toString(),
            data: {
              backgroundColor: '#00FFFF',
            },
            position: {
              x: Math.random() * 21,
              y: Math.random() * 31,
            },
          };

          if (this.graphDatavisaul.nodes.includes(node2)) {
          }
          else {
            this.graphDatavisaul.nodes.push(node2);

          }

          g.addVertex(destVertex);



        }
        else {
          destVertex = g.getVertex(link);
        }

        if (srcVertex !== null && destVertex !== null && !g.containsEdgeName(source, link)) {
          const edge = new CustomEdge(srcVertex, destVertex);
          //	        			System.out.println("Adding Edge "+ edge.getEdgeName());
          g.addEdge(edge);

          const edge2: Edge = {
            source: source,
            target: link,
          };
          const edge3: Edge = {
            source: link,
            target: source,
          };
          if (this.graphDatavisaul.links.includes(edge2) || this.graphDatavisaul.links.includes(edge3) ) {
          }
          else {
            this.graphDatavisaul.links.push(edge2);

          }

        }


      }

      if (srcVertex !== null) {
        // g.printGraph();
        g.FirstFitAlgo(srcVertex);
        // g.printVertexColors();


      }



      this.updateGraph();

    
      const co = g.getVertex(source)?.getColor();
      if (co !== undefined) {
        this.graphDatavisaul.nodes[i].data.backgroundColor = colors[co];
        if(this.colorsbyalgo<co)
          this.colorsbyalgo=co;
      }
      i++;
      


    } 

    this.ratio=this.colorsbyalgo/this.k;
  }



  public getStyles(node: Node): any {
    return {
      'background-color': node.data.backgroundColor,
    };
  }

  public onOptionsSelected() {
    const value = this.inputForm.value.algo;
    console.log(value)
    if(value==="firstfit"){
      this.colorGraph()
     
    }
    else if(value==="CBIP"){
      
      console.log(this.k + "k")
      if(this.k<3){
      this.colorGraph2(this.gloabalgraph)
      }
      else{
        this.inputForm.get("algo")?.setValue("firstfit");

        this.open(this.myModal)
      }
      
    }
}


  onSubmit() {
   
    this.k=this.inputForm.value.cromaticNumber;
    if(this.inputForm.value.cromaticNumber<2){
      this.msg="k can't be less then 2"
      this.open(this.myModal);
    }
    else if(this.inputForm.value.cromaticNumber>2 && this.inputForm.value.algo==="CBIP"){
      this.msg="k can't be more then 2 for CBIP"
      this.open(this.myModal);
    }
    else{
    if(this.inputForm.value.cromaticNumber && this.inputForm.value.numberofNodes && this.inputForm.value.algo)
      this.generator2_0(this.inputForm.value.numberofNodes, this.inputForm.value.cromaticNumber, this.inputForm.value.Probability,this.inputForm.value.algo);
    
    this.updateGraph();
    this.fitGraph();
    }
  }

  add_edge(edges: number[][], u: number, v: number): void {
    if (u == v) return;
    for (let i = 0; i < edges.length; i++) {
      if (
        (edges[i][0] === u && edges[i][1] === v) ||
        (edges[i][0] === v && edges[i][1] === u)
      ) {
        return;
      }
    }
    if (v < u) {
      edges.push([v, u]);
    } else {
      edges.push([u, v]);
    }
  }

getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

graphGeneration2(n: number, k: number, p: number): number[][]{
  const graph: Set<number>[] = [];
        for (let i = 0; i < n; i++) {
            graph.push(new Set<number>());
        }
        const v: number[] = [];
        for (let i = 0; i < n; i++) {
            v.push(i);
        }
        this.shuffle(v);
        const setlist: Set<number>[] = [];
        for (let i = 0; i < k; i++) {
            const newset = new Set<number>();
            let val = i;
            while (val < n) {
                newset.add(v[val]);
                val += k;
            }
            setlist.push(newset);
        }
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.diffset(i, j, setlist) && Math.random() < p) {
                    graph[i].add(j);
                    graph[j].add(i);
                }
            }
        }
        return this.convert(graph);
}
convert(graph: Set<number>[]): number[][] {
  const newgraph: number[][] = [];
  for (let i = 0; i < graph.length; i++) {
      newgraph.push(Array.from(graph[i]));
  }
  return newgraph;
}

diffset(i: number, j: number, setlist: Set<number>[]): boolean {
  for (const set of setlist) {
      if (set.has(i) && set.has(j)) {
          return false;
      }
  }
  return true;
}

shuffle(array: number[]): void {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

generator2_0(n:number,k:number,p:number,s:string){

  this.graphDatavisaul.nodes = [];
    this.graphDatavisaul.links = [];


    this.graphData.nodes = [];
    this.graphData.links = [];
    this.layoutSettings.edgePadding = 0;
    this.fitContainer = true;
    this.autoZoom = true;
    this.panOnZoom = true;
    this.enableZoom = true;
    this.autoCenter = true;
    this.showLegend = false;

    this.panOffsetX = 0;
    this.panOffsetY = 0;
    this.myMinWidth = 350;
    this.myMinHeight = 100;

   const graph = this.graphGeneration2(n, k, p);

    for (let i = 0; i < graph.length; i++) {

      const node: Node = {
        id: i.toString(),
        label: i.toString(),
        data: {
          backgroundColor: '#00FFFF',
        },
        position: {
          x: Math.random() * 21,
          y: Math.random() * 31,
        },
      };


      
        this.graphData.nodes.push(node);
        
   

      for (let p = 0; p < graph[i].length; p++) {
        
        const edge: Edge = {
          source: i.toString(),
          target: graph[i][p].toString(),
        };

        if (
          !this.graphData.links.some(
            (l) =>
              (l.source === edge.source &&
                l.target === edge.target) ||
              (l.source === edge.target && l.target === edge.source)
          )
        ) {
          this.graphData.links.push(edge);
        }
        

      }
           
        }

      if(s==="firstfit"){
        this.colorGraph()
        this.gloabalgraph=graph;
      }
      else{
        this.colorGraph2(graph)
        this.gloabalgraph=graph;
      }
      


}

}




// generator(n: number, k: number, p: number): void {

    

//   let groups: number[][] = [];
//   let edges: number[][] = [];
//   for (let i = 0; i < k; i++) {
//     groups.push([]);
//   }
//   for (let vertex = 1; vertex <= k; vertex++) {
//     groups[vertex - 1].push(vertex);
//   }
//   for (let vertex = k + 1; vertex <= n; vertex++) {
//     groups[this.getRandomInt(k)].push(vertex);
//   }
//   for (let i = 0; i < groups.length; i++) {
//     for (let u of groups[i]) {
//       // for (let k = 0; k < groups.length; k++) {
//       //   if (groups[k].includes(u)) {
//       //     continue;
//       //   }
//       //   let v = groups[k][this.getRandomInt(groups[k].length)];
//       //   this.add_edge(edges, u, v);
//       // }
//       for (let k = 0; k < groups.length; k++) {
//         if (groups[k].includes(u)) {
//           continue;
//         }
//         for (let v of groups[k]) {
//           if (Math.random() <= p) {
//             this.add_edge(edges, u, v);
//           }
//         }
//       }
//     }
//   }

//   for (let k = 0; k < groups.length; k++) {
//     let temp = { id: '', backgroundColor: '#DC143C', to: [] as string[] };
//     for (let v = 0; v < groups[k].length; v++) {
//       temp.id = groups[k][v].toString();
//       for (let p = 0; p < edges.length; p++) {
//         if (edges[p].includes(groups[k][v])) {
//           for (let e of edges[p]) {
//             if (e != groups[k][v]) {
//               if (!temp.to.includes(e.toString())) {
//                 const node: Node = {
//                   id: groups[k][v].toString(),
//                   label: groups[k][v].toString(),
//                   data: {
//                     backgroundColor: '#00FFFF',
//                   },
//                   position: {
//                     x: Math.random() * 21,
//                     y: Math.random() * 31,
//                   },
//                 };

//                 if (!this.graphData.nodes.some((n) => n.id === node.id)) {
//                   this.graphData.nodes.push(node);
//                 }

//                 const edge: Edge = {
//                   source: groups[k][v].toString(),
//                   target: e.toString(),
//                 };

//                 if (
//                   !this.graphData.links.some(
//                     (l) =>
//                       (l.source === edge.source &&
//                         l.target === edge.target) ||
//                       (l.source === edge.target && l.target === edge.source)
//                   )
//                 ) {
//                   this.graphData.links.push(edge);
//                 }
//               }
//             }
//           }
//         }
//       }
//       this.layoutSettings.edgePadding = 0;
//     }

//     console.log(this.graphData.nodes);


//   }

//   this.colorGraph();
// }