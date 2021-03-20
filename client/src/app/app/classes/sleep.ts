export async function sleep(ms: number = 1): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
