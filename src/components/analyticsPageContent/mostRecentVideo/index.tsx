"use client";

import Link from "next/link";
import { createSerializer, parseAsString } from "nuqs";
import { ComponentProps, ComponentPropsWithoutRef } from "react";

import { formatNumber } from "@/components/graphs/view-comparisons";
import { Button } from "@/components/ui/button";
import { useYouTube } from "@/hooks/use-youtube";

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
	// Get post from externalYouTubeId
	const { getPostAnalytics } = useYouTube();
	const { data: post } = getPostAnalytics({ youtubePostId: id });

	// Video may exist but the post with us may not
	if (!url) {
		return null;
	}

	const serialize = createSerializer({
		v: parseAsString,
	});

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
				href={serialize({ v: post?.id ?? "" })}
			>
				More video analytics
			</PaginationButton>
		</div>
	);
}
