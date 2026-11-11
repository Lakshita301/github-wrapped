import { Link } from "react-router-dom";
import "./StatusScreen.css";

export default function StatusScreen({ type, message }) {
  const isError = type === "error";

  return (
    <div className="status" role={isError ? "alert" : "status"}>
      {isError ? (
        <>
          <h2 className="status__title">Something went wrong</h2>
          <p className="status__msg">{message}</p>
          <Link className="status__btn" to="/">
            ← Try another username
          </Link>
        </>
      ) : (
        <>
          <div className="status__spinner" aria-hidden="true" />
          <p className="status__msg">Unwrapping the stats…</p>
        </>
      )}
    </div>
  );
}