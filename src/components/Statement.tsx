import { SITE } from "../data/site";
import { EditorialImage } from "./EditorialImage";
import { Reveal } from "./Reveal";
import "./Statement.css";

export function Statement() {
  return (
    <section className="statement" id="about" aria-labelledby="statement-heading">
      <div className="statement__media">
        <EditorialImage
          name="filing"
          alt="Sebastian Alvarez reviewing plans with clients at a table"
          objectPosition="48% 28%"
          sizes="(max-width: 900px) 100vw, 44vw"
        />
      </div>
      <Reveal className="statement__copy">
        <h2 id="statement-heading">
          Real estate is personal
          <br />
          long before it becomes
          <br />
          transactional.
        </h2>
        <p>
          Sebastian believes a strong real-estate experience starts with
          understanding the person behind the move.
        </p>
        <p>
          Whether buying, selling, or planning what comes next, his approach is
          centered on clear communication, thoughtful preparation, and guidance
          built around the client's priorities.
        </p>
        <p className="statement__sign">
          <span>{SITE.name}</span>
          <span>{SITE.practice}</span>
        </p>
      </Reveal>
    </section>
  );
}
