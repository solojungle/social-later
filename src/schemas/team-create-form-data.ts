export interface TeamCreationFormData {
	name: string;
	subscription: {
		id: string;
		name: string;
		currency: string;
		price: number;
		priceFormatted: string;
		priceId: string;
	};
}
