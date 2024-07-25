"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Countdown() {
	const [count, setCount] = useState(10);
	const router = useRouter();

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (count > 0) {
			const timer = setTimeout(() => setCount(count - 1), 1000);
			return () => clearTimeout(timer);
		}
		router.push("/nexus");
	}, [count, router]);

	return <h1>{count}</h1>;
}
