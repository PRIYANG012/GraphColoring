

import { Component, Input ,ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import {
  DagreSettings,
  Edge,
  Layout,
  Node,
  Orientation,
} from '@swimlane/ngx-graph';
import { GraphsService } from '../services/graphs.service';

export class Vertex {
  id!: string;
  backgroundColor!: string;
  to!: string[];
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent {
  @ViewChild('container') container!: ElementRef;
  containerWidth!: number;
  containerHeight!: number;
  ngAfterViewInit() {
    this.containerWidth = this.container.nativeElement.offsetWidth;
    this.containerHeight = this.container.nativeElement.offsetHeight;
  }
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();

  updateGraph() {
    this.update$.next(true)
  }
  centerGraph() {
    this.center$.next(true)
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
    ranker: 'longest-path',
  };
  

  layout: string | Layout = 'colaForceDirected';

  constructor(private modalService: NgbModal,private cdRef: ChangeDetectorRef,public graphService: GraphsService) {
    this.vertex = [
      {
        id: '1',
        backgroundColor: '#DC143C',
        to: ['2', '3'],
      },
      {
        id: '2',
        backgroundColor: '#00FFFF',
        to: ['1', '3'],
      },
      {
        id: '3',
        backgroundColor: '#00FFFF',
        to: ['1', '2'],
      },
      {
        id: '4',
        backgroundColor: '#00FFFF',
        to: ['5'],
      },
      {
        id: '5',
        backgroundColor: '#8A2BE2',
        to: ['4'],
      },
    ];
    
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public ngOnInit(): void {
    for (const vertex of this.vertex) {
      const node: Node = {
        id: vertex.id,
        label: vertex.id,
        data: {
          backgroundColor: vertex.backgroundColor,
        },
      };
      this.graphService.nodes.push(node);
    }

    for (const v of this.vertex) {
      for (const t of v.to) {
        const edgeinvert: Edge = {
          source: t,
          target: v.id,
        };
        const foundObject = this.graphService.links.find(
          (obj) =>
            obj.source === edgeinvert.source && obj.target === edgeinvert.target
        );

        if (foundObject) {
        } else {
          const edge: Edge = {
            source: v.id,
            target: t,
          };
          this.graphService.links.push(edge);
        }
      }
    }

    this.center$.next(true)


  }

  public getStyles(node: Node): any {
    return {
      'background-color': node.data.backgroundColor,
    };
  }

 

  public add(): any{
    const node: Node = {
      id: '10',
      label: '10',
      data: {
        backgroundColor: "#00FFFF",
      },
    };

    const edge: Edge = {
      source: '10',
      target: '1',
    };
    this.graphService.nodes.push(node);
    this.graphService.links.push(edge)
    
    this.updateGraph()

  }
  
  

 
}
