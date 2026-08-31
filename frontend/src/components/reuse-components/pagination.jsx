export default function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return (
    <nav className="invoiceCRM-table-bottem">
      <p className="invoiceCRM-num-entries">Showing page {!totalPages ? 0 :currentPage} of {totalPages}</p>
      <div className="invoiceCRM-manage-control-box">
        <button
          className="invoiceCRM-manage-btn"
          onClick={onPrev}
          disabled={!totalPages || currentPage === 1}
        >
          Prev
        </button>
        <nav className="invoiceCRM-num-page">
          Page {!totalPages ? 0 : currentPage} of {totalPages}
        </nav>
        <button
          className="invoiceCRM-manage-btn"
          onClick={onNext}
          disabled={!totalPages || currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
