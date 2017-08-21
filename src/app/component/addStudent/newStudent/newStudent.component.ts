import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AdminService } from '../../../providers/admin.service';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../providers/formValidation.service';
import { Router } from '@angular/router';

declare let $: any;
@Component({
  // selector: 'new-student',
  templateUrl: './newStudent.component.html',
  styleUrls: ['./newStudent.component.css'],
})

export class NewStudentComponent {

  public loader: boolean = false;

  //NewStudent

  public standards: any[];
  // public parents: any[] = [{ id: 1, name: 'Father' },
  // { id: 2, name: 'Mother' },
  // { id: 3, name: 'Guardian' }];
  public parent: any[];

  public newStudentForm: FormGroup;


  constructor(public _location: Location,
    public as: AdminService,
    public fb: FormBuilder,
    public router: Router) {
    this.getStandards();
    this.initNewStudentForm();
  }

  //New Student Functions

  public getStandards() {
    this.loader = true;
    this.as.getStandards().subscribe(res => {
      this.standards = res;
      this.loader = false;
    },
      err => {
        this.errorPage();
        // console.log("err", err);
      })
  }

  // public onParent(p:any,i:any){
  //   this.selectedParent.push(p);
  //   console.log(this.selectedParent);

  // }

  public initNewStudentForm() {
    this.newStudentForm = this.fb.group({
      name: ['', [Validators.required]],
      standardId: ['', [Validators.required]],
      parent: this.fb.array([
        this.inItParent(),
      ])
    });
  }


  public inItParent() {
    // console.log(this.newStudentForm.parent.value);
    return this.fb.group({
      "name": ['', [Validators.required]],
      "nickName": [''],
      "contactNo": ['', [Validators.required, Validators.pattern('[2-9]{2}[0-9]{8}$')]],
      "email": ['', [ValidationService.emailValidator]],
    });
  }

  public addParent(e: any) {
    const control = <FormArray>e.controls['parent'];
    control.push(this.inItParent());
  }

  public removeParent(form: any, index: any) {
    const control = <FormArray>form.controls['parent'];
    control.removeAt(index);
  }

  public submitNewStudent() {
    this.as.addStudent(this.newStudentForm.value).subscribe(res => {
      // console.log(res);
      this.loader=true;
      $('#addModal').modal('show');
      // this.selectedStudent = null;
      this.initNewStudentForm();
      this.loader= false;
    },
      err => {
        // console.log(err);
        if (err === "400 - Bad Request") {
          this.initNewStudentForm();
          $('#errModal').modal('show');
        }
        else{
          this.errorPage();
        }
      })
  }
  

     public errorPage() {
    this.loader = false;
     this.router.navigate(['/error']);
  }



}