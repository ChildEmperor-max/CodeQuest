public class HarmonyBlend {
    public static void main(String[] args) {
        int quantity = 5;
        double price = 19.99;
        String product = "Code Harmony Blend";

        String purchaseSummary = "Total cost for " + quantity + " " + product + " is: $" + (quantity * price);
        System.out.println(purchaseSummary);
    }
}
