import { useNavigate } from "react-router-dom";
import Button from "./Button";

type PaginationProps = {
    currentPage: number,
    totalPage: number,
}

export default function Pagination({ currentPage, totalPage }: PaginationProps) {

    const links:React.ReactElement[] = [];
    const pageRangeDisplayed = 5;
    const navigate = useNavigate();

    function createPaginationLinks() {
      let startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
      let endPage = Math.min(totalPage, startPage + pageRangeDisplayed - 1);

      if (endPage - startPage < pageRangeDisplayed - 1) {
        startPage = Math.max(1, endPage - pageRangeDisplayed + 1);
      }

      for (let link = startPage; link <= endPage; link++) {
          links.push(
            <Button 
              key={ link }
              className={`text-white w-8 aspect-square ${(link === currentPage ? 'bg-rose-400' : 'bg-rose-300')}`}
              onClick={ () => navigate(`?page=${link}`)}
            >
              { link }
            </Button>
          );
      }
    }

    if(totalPage > 1) createPaginationLinks();

    return(
        <div className="w-full flex justify-center items-center gap-1">
            { links }
        </div>
    );
}