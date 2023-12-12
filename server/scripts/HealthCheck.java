public class HealthCheck {
    public static void main(String[] args) {
        int health = 80;

        if (health >= 90) {
              System.out.println("You are in excellent health!");
        } else {
              System.out.println("Your health is not optimal. Consider healing.");
        }
    }
}