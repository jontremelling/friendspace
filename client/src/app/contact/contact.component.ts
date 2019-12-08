import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    @Input() contact: any;
    @Input() deletable: boolean;
    @Input() canAdd: boolean;
    @Output() notifyParent: EventEmitter<any> = new EventEmitter();
    @Output() notifyParentAdd: EventEmitter<any> = new EventEmitter();

    constructor() {}
  
    ngOnInit() {
    }

    onDelete() {
        this.notifyParent.emit(this.contact._id);
    }

    onAdd() {
        this.notifyParentAdd.emit(this.contact._id);
    }
}
