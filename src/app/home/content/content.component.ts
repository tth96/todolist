import { Component, OnInit } from '@angular/core';
import { HttpsService } from './https.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormAddData } from '../../interface';





@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  formadddata: FormGroup;
  changedata: FormGroup;
  info: FormAddData[];
  checklist: number[] = [];
  tododetail: FormAddData;
  itemdata: FormAddData;
  ShowAddForm: boolean = false;
  public idchange;
  isShow: boolean = true;
  public shareID: number;
  showDelete: Boolean = false;
  showDeleteSelect: Boolean = false;
  showDeleteAll: Boolean = false;
  disabledCheck: Boolean = false;


  constructor(private fb: FormBuilder, private service: HttpsService) { }

  ngOnInit() {
    // Form Add-data
    this.formadddata = this.fb.group({
      todoTitle: ['', [Validators.required]],
      todoDescription: ['', [Validators.required]],
      todoTime: ['', [Validators.required]],
      todoId: ['', [Validators.required]]
    });

    // Form Put-data
    this.changedata = this.fb.group({
      todoTitle: ['', [Validators.required]],
      todoDescription: ['', [Validators.required]],
      todoTime: ['', [Validators.required]],
      todoId: ['', [Validators.required]]
    });


    // Get data by server
    this.service.getData()
      .subscribe(
        data => this.info = data,
      );
  }

  // Post New data
  postNewData(formadddata: FormAddData): void {
    const newinfo = this.formadddata.value;
    this.service.postData(newinfo)
      .subscribe(postdata => {
        this.info.push(postdata);
        console.log(this.info);
      });
    this.formadddata.reset();
    this.ShowAddForm = false;
  }

  //  Show Form Put Data
  showFormPutData(info: FormAddData, id: number) {
    this.isShow = !this.isShow;
    this.ShowAddForm = false;
    this.itemdata = info;
    this.idchange = info.todoId;
    this.changedata.get('todoId').setValue(this.itemdata.todoId);
    this.changedata.get('todoTitle').setValue(this.itemdata.todoTitle);
    this.changedata.get('todoDescription').setValue(this.itemdata.todoDescription);
    this.changedata.get('todoTime').setValue(this.itemdata.todoTime);
  }

  // Cancel Form Put Data
  cancelFormPutdata() {
    this.isShow = !this.isShow;
  }

  // Put new data 
  putData(changedata: FormAddData): void {
    const newdata = this.changedata.value;
    this.service.updateData(newdata)
      .subscribe(() => this.loadData());
    this.isShow = !this.isShow;
  }
  loadData():void{
    this.service.getData().subscribe(
      data => this.info = data,
    );
  }
  //Share todoId to Delete Data
  shareId(id: number) {
    this.shareID = id;
    this.showDelete = !this.showDelete;
  }

  // Delete Data
  deleteData(): void {
    this.service.deleteData(this.shareID).subscribe(_ => {this.info = this.info.filter(td => td.todoId != this.shareID),this.loadData()});
    this.showDelete = !this.showDelete;
  }
  
  // Delete All Data
  deleteAllData(): void {
    this.service.deleteAll().subscribe(_ => {this.info = [], this.loadData()});
    this.showDeleteAll = !this.showDeleteAll;
  }


  // Delete Select
  deleteSelectData(): void {
    const listselected = JSON.stringify(this.checklist);
    this.service.deleteSelect(this.checklist).subscribe(() => this.loadData());
    this.showDeleteSelect = !this.showDeleteSelect;
  }

  // Check id checkbox
  checked(id: number): void {
    if (this.checklist.find(item => item == id) != null) {
      this.checklist = this.checklist.filter(item => item != id);
      if(this.checklist.length > 0){
        this.disabledCheck = true;
      } else{
        this.disabledCheck = false;
      }
    }
    else {
      this.checklist.push(id);
      console.log(this.checklist.length);

      this.disabledCheck = true;
    }
    console.log(`${JSON.stringify(this.checklist)}`);
  }
  
}
