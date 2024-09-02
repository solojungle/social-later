"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ComponentProps, ComponentPropsWithoutRef, useCallback } from "react";

import { formatNumber } from "@/components/graphs/view-comparisons";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

type Props = {
	id: string;
	thumbnail: string;
	title: string;
	url: string;
	views: string;
};

type PaginationButtonProps =
	| (ComponentProps<typeof Link> & { disabled?: false })
	| (ComponentPropsWithoutRef<"button"> & { disabled: true });

function PaginationButton(props: PaginationButtonProps) {
	if (props.disabled) {
		const { disabled, ...rest } = props;
		return (
			<Button disabled={disabled} asChild>
				<button type="button" {...rest} />
			</Button>
		);
	}

	return (
		<Button asChild size="sm">
			<Link {...props} />
		</Button>
	);
}

export function MostRecentVideo({ thumbnail, title, views, url, id }: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Get post from externalYouTubeId
	const { data: post } = api.post.getFromExternalId.useQuery(
		{
			externalPostId: id,
		},
		{
			enabled: !!id,
			staleTime: 1000 * 60 * 60 * 24, // 24 hours
		},
	);

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	if (!url) {
		return null;
	}

	return (
		<div className="w-full rounded-sm border border-border p-3 text-sm">
			<div className="mb-4">
				<h2 className="font-medium">Most Recent Video</h2>
			</div>
			<div className="mb-6 flex flex-col items-center space-y-1 ">
				<a href={url} target="_blank" rel="noreferrer" className="w-full">
					<img
						src={thumbnail}
						alt="thumbnail"
						className="aspect-video w-full rounded-lg object-cover"
					/>
				</a>
				<div className="w-full">
					<p className="mb-4 line-clamp-1 font-medium">{title}</p>
					<div className="flex space-x-2">
						<p>Total views -</p>
						<p className="font-medium">{formatNumber(views)}</p>
					</div>
				</div>
			</div>

			<PaginationButton
				className="w-full"
				disabled={!post}
				href={`${pathname}?${createQueryString("v", post?.id ?? "")}`}
			>
				More video analytics
			</PaginationButton>
		</div>
	);
}
