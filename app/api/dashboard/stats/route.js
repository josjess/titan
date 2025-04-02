export async function GET() {
    try {
      const loansRes = await fetch(`${process.env.NEXT_PUBLIC_FINERACT_API}/loans`, {
        headers: {
          "Fineract-Platform-TenantId": process.env.NEXT_PUBLIC_FINERACT_TENANT,
          "Authorization": `Basic ${process.env.AUTH_TOKEN}`
        }
      });
  
      const usersRes = await fetch(`${process.env.NEXT_PUBLIC_FINERACT_API}/users`, {
        headers: {
          "Fineract-Platform-TenantId": process.env.NEXT_PUBLIC_FINERACT_TENANT,
          "Authorization": `Basic ${process.env.AUTH_TOKEN}`
        }
      });
  
      const loansData = await loansRes.json();
      const usersData = await usersRes.json();
  
      console.log("Loans API Response:", loansData); // Debugging
  
      if (!Array.isArray(loansData)) {
        return new Response(JSON.stringify({ error: "Invalid loans data" }), { status: 500 });
      }
  
      const today = new Date().toISOString().split("T")[0]; // Get today's date
      const loansDueToday = loansData.filter((loan) => loan.dueDate === today).length;
  
      return new Response(JSON.stringify({
        loansCount: loansData.length,
        loansDueToday,
        usersCount: Array.isArray(usersData) ? usersData.length : 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  
    } catch (error) {
      console.error("Error fetching data:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  