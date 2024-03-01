import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { PostsService } from "./services/posts.service";
import { PostsStore } from "./store/components.store";

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [PostsStore],
})
export class PostsComponent {
  fb = inject(FormBuilder);
  postsService = inject(PostsService)
  store = inject(PostsStore)
  addForm = this.fb.nonNullable.group({
    title: ''
  });

  onAdd(): void {
    this.store.addPost(this.addForm.getRawValue().title);
    this.addForm.reset();
  }
}
