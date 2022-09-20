import { toAbsoluteUrl } from "../../../helpers";

export function FallbackView() {
  return (
    <div className="splash-screen">
      <img
        src={toAbsoluteUrl("/media/svg/rankme/default.svg")}
        alt="RankME logo"
        className="mh-300px"
        style={{ width: "300px" }}
      />
      <span>Loading ...</span>
    </div>
  );
}
