export default function MultipleAnswer() {
  return (
    <div>
      <div className="flex flex-col justify-center gap-3 w-[100vw] scale-120">
        <div>
          <input type="checkbox" id="question" className="scale-150 mr-3" />
          <label htmlFor="Question" className="align-midle">
            test
          </label>
        </div>
        <div>
          <input type="checkbox" id="question" className="scale-150" />
          <label htmlFor="Question" className="align-midle">
            test
          </label>
        </div>
        <div>
          <input type="checkbox" id="question" className="scale-150" />
          <label htmlFor="Question" className="align-midle">
            test
          </label>
        </div>
      </div>
    </div>
  );
}
