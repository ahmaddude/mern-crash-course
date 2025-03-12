import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		console.log("Sending data:", newProduct); // Debugging line
		try {
			const res = await fetch("http://localhost:5000/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newProduct),
			});
	
			console.log("Response status:", res.status);
			const text = await res.text(); // Read raw response before parsing
			console.log("Raw response:", text);
	
			const data = JSON.parse(text); // Manually parse JSON
			console.log("Received data:", data);
	
			set((state) => ({ products: [...state.products, data.data] }));
			return { success: true, message: "Product created successfully" };
		} catch (error) {
			console.error("Error in createProduct:", error);
			return { success: false, message: "Failed to create product" };
		}
	},
	
	fetchProducts: async () => {
		const res = await fetch("/api/products");
		const data = await res.json();
		set({ products: data.data });
	},
	deleteProduct: async (pid) => {
		const res = await fetch(`/api/products/${pid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return { success: true, message: data.message };
	},
	updateProduct: async (pid, updatedProduct) => {
		const res = await fetch(`/api/products/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedProduct),
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({
			products: state.products.map((product) => (product._id === pid ? data.data : product)),
		}));

		return { success: true, message: data.message };
	},
}));

