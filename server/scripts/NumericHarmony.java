public class NumericHarmony {
    public static void main(String[] args) {
        int a = 8;
        int b = 12;

        int sumAB = a + b;
        int differenceAB = a - b;
        int productAB = a * b;
        int quotientAB = a / b;

        int maximumAB = Math.max(a, b);

        System.out.println("Sum: " + sumAB);
        System.out.println("Difference: " + differenceAB);
        System.out.println("Product: " + productAB);
        System.out.println("Quotient: " + quotientAB);
        System.out.println("Maximum: " + maximumAB);
    }
}