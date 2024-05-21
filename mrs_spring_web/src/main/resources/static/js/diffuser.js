async function query(data) {
	try {
		const response = await fetch(
			"https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
			{
				headers: {
					Authorization: "Bearer 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",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify(data),
			}
		);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.blob();
		return result;
	} catch (error) {
		console.error("Error querying the API:", error);
	}
}

query({ inputs: "ocean, trip, mood, Album Art" }).then((blob) => {
	if (blob) {
        const url = URL.createObjectURL(blob);
        const img = document.getElementById("diffuser");
        img.src = url;
    }
});