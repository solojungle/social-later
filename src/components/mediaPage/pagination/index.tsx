import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function PagePagination({ pagination }: { pagination: any }) {
	const {
		fetchNextPage,
		hasNextPage,
		setCurrentPage,
		isFetchingNextPage,
		currentPage,
		totalPages,
		setPageSize,
		pageSize,
	} = pagination;

	return (
		<div className="mt-4 flex items-center justify-end border-t border-border bg-background px-2 py-4">
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${pageSize}`}
						onValueChange={(value) => {
							setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[2, 4, 8].map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {currentPage + 1} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						// setCurrentPage
						onClick={() => setCurrentPage(0)}
						disabled={currentPage === 0}
					>
						<span className="sr-only">Go to first page</span>
						<DoubleArrowLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 0}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => {
							fetchNextPage();

							setCurrentPage(currentPage + 1);
						}}
						disabled={currentPage + 1 >= totalPages || isFetchingNextPage}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => {
							if (totalPages <= currentPage + 1) {
								fetchNextPage();
							}
							setCurrentPage(totalPages - 1);
						}}
						disabled={currentPage + 1 >= totalPages}
					>
						<span className="sr-only">Go to last page</span>
						<DoubleArrowRightIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
