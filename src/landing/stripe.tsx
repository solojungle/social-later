"use client";

import React, { useEffect } from "react";

const StripePricingTable = () => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://js.stripe.com/v3/pricing-table.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);
	return React.createElement("stripe-pricing-table", {
		"pricing-table-id": "prctbl_1OHXsqBvZcw5DSHUGJq1drge",
		"publishable-key":
			"pk_live_51OHXWpBvZcw5DSHUHe4byCwlMX7REAAcHI7z5NqV7KUONk5c7MZbL2c3nc5AdhYSs5bVLsU2sd8MLjShjHM2sZdR00QqdDULWt",
	});
};

export default StripePricingTable;
