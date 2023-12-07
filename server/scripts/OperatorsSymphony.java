public class OperatorsSymphony {
    public static void main(String[] args) {
        // Declare and initialize variables
        int a = 15;
        int b = 7;
        boolean isSunny = true;

        // Arithmetic Operators
        int sum = a + b;
        int difference = a - b;
        int product = a * b;
        int quotient = a / b;
        int remainder = a % b;

        // Relational Operators
        boolean isEqual = (a == b);
        boolean isNotEqual = (a != b);
        boolean isGreaterThan = (a > b);
        boolean isLessThan = (a < b);
        boolean isGreaterOrEqual = (a >= b);
        boolean isLessOrEqual = (a <= b);

        // Logical Operators
        boolean andResult = (a > 0 && b > 0 && isSunny);
        boolean orResult = (a > 0 || b > 0 || isSunny);
        boolean notResult = !isSunny;

        // Display the results
        System.out.println("Sum: " + sum);
        System.out.println("Difference: " + difference);
        System.out.println("Product: " + product);
        System.out.println("Quotient: " + quotient);
        System.out.println("Remainder: " + remainder);

        System.out.println("Is Equal: " + isEqual);
        System.out.println("Is Not Equal: " + isNotEqual);
        System.out.println("Is Greater Than: " + isGreaterThan);
        System.out.println("Is Less Than: " + isLessThan);
        System.out.println("Is Greater or Equal: " + isGreaterOrEqual);
        System.out.println("Is Less or Equal: " + isLessOrEqual);

        System.out.println("Logical AND Result: " + andResult);
        System.out.println("Logical OR Result: " + orResult);
        System.out.println("Logical NOT Result: " + notResult);
    }
}
