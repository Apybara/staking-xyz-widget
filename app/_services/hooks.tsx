import { useState } from "react";

export const useProceduralStates = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	return {
		isLoading,
		setIsLoading,
		isSuccessful,
		setIsSuccessful,
		error,
		setError,
	}
};

