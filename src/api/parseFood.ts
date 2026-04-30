export async function parseFood(text: string) {
    const res = await fetch(
        "https://kjlpokvfhqsxtetujkre.supabase.co/functions/v1/parse-food",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbHBva3ZmaHFzeHRldHVqa3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzgzOTUsImV4cCI6MjA5MDk1NDM5NX0.aBXYNnd1MDJS6WWVeS0gjxRHJ06gypiQXwRco6f51uE`,
            },
            body: JSON.stringify({ text }),
        }
    );

    return await res.json();
}