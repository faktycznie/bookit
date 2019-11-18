import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

export interface Item { name: string; }

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<any[]>;

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private authService: AuthService
    ) {
    this.itemsCollection = db.collection<Item>('items');
    this.items = this.itemsCollection.valueChanges();
  }

  ngOnInit() {
  }

  addItem(item: Item) {
    this.itemsCollection.add(item);
  }

  toLogin() {
    this.router.navigate(['./login']);
  }


}
