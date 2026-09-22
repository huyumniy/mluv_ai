import styles from "./Pagination.module.css";
import { Button } from "../Button";
import type { PaginationProps } from "./Pagination.types";
import { ArrowLeftIcon } from "@/shared/assets/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/shared/assets/icons/ArrowRightIcon";
import { getPaginationItems } from "./getPaginationItems";

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationItems = getPaginationItems(currentPage, totalPages);
  console.log(paginationItems)
  return (
    <div className={styles.pagination}>
      <Button
        className={styles.paginationButton}
        variant="secondary"
        size="sm"
        key="previous"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}

      >
        {<ArrowRightIcon />}
      </Button>
      {paginationItems.map((item, index) => {
        if (typeof item !== "number") {
          return (
            <span key={item} className={styles.dots}>
              ...
            </span>
          );
        }
        return (
          <Button
            className={styles.paginationButton}
            key={index}
            data-active={currentPage === item}
            onClick={() => setCurrentPage(item)}
            variant="secondary"
            size="sm"
          >
            {item}
          </Button>
        );
      })}
      <Button
        className={styles.paginationButton}
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        key="next"
      >
        {<ArrowLeftIcon />}
      </Button>
    </div>
  );
}
