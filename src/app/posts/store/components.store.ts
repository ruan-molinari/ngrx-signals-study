import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { PostInterface } from "../types/post.interface";
import { PostsService } from "../services/posts.service";

export interface PostsStateInterface {
  posts: PostInterface[];
  isLoading: boolean;
  error: string | null;
}

export const PostsStore = signalStore(
  withState<PostsStateInterface>({
    posts: [],
    error: null,
    isLoading: false,
  }),
  withComputed(store => ({
    postsCount: computed(() => store.posts().length)
  })),
  withMethods((store, postsService = inject(PostsService)) => ({
    addPost(title: String) {
      const newPost: PostInterface = {
        id: crypto.randomUUID(),
        title,
      };

      const updatedPosts = [...store.posts(), newPost];
      patchState(store, { posts: updatedPosts })
    },
    removePost(id: String) {
      const updatedPosts = store.posts().filter((post) => post.id !== id)
      patchState(store, { posts: updatedPosts })
    },
    loadPosts: rxMethod<void>(
      pipe(
        switchMap(() => {
          return postsService.getPosts().pipe(
            tap(posts => {
              patchState(store, { posts })
            })
          )
        })
      )
    )
  })),
  withHooks({
    onInit(store) {
      store.loadPosts();
    }
  })
)
