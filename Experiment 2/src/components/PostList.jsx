import { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../features/postsSlice";
import { totalPosts } from "../features/selectors";

function PostList() {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.posts);
  const count = useSelector(totalPosts);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => a.id - b.id);
  }, [posts]);

  return (
    <div>
      <h2 className="total">📄 Total Posts: {count}</h2>

      {sortedPosts.length === 0 ? (
        <p className="empty">No Posts Available</p>
      ) : (
        sortedPosts.map((post) => (
          <div className="card" key={post.id}>
            <h3>{post.title}</h3>

            <p>
              📱 Platform: <b>{post.platform}</b>
            </p>

            <button
              className="delete-btn"
              onClick={() => dispatch(deletePost(post.id))}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default memo(PostList);