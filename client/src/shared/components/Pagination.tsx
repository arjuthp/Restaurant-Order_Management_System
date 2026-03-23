import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        {totalItems !== undefined && (
          <span className={styles.totalItems}>
            Total: {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        )}
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className={styles.controls}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`${styles.button} ${styles.navButton}`}
          aria-label="Previous page"
        >
          ← Previous
        </button>

        <div className={styles.pages}>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={page === '...' || page === currentPage}
              className={`${styles.button} ${styles.pageButton} ${
                page === currentPage ? styles.active : ''
              } ${page === '...' ? styles.ellipsis : ''}`}
              aria-label={typeof page === 'number' ? `Go to page ${page}` : undefined}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`${styles.button} ${styles.navButton}`}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
};
