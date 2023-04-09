import { Injectable } from '@angular/core';
import {
  DagreSettings,
  Edge,
  Layout,
  Node,
  Orientation,
} from '@swimlane/ngx-graph';
@Injectable({
  providedIn: 'root'
})
export class GraphsService {
   nodes: Node[] = [];
   links: Edge[] = [];
  constructor() { }
}
