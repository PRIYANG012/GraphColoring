import { Component, Input,ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import {
  DagreSettings,
  Edge,
  Graph,
  Layout,
  Node,
  Orientation,
} from '@swimlane/ngx-graph';
// import { GraphsService } from './services/graphs.service';
import { CanvasComponent } from './canvas/canvas.component';

export class Vertex {
  id!: string;
  backgroundColor!: string;
  to!: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  adjMatrix!: number[][];
	groups!: number[][];
	

  title = 'Main';

  constructor(private modalService: NgbModal,private graph: CanvasComponent) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

 

}
