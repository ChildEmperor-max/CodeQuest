public class WeaponChooser {
    public static void main(String[] args) {
        int choice = 2;

        switch (choice) {
            case 1:
                System.out.println("Sword chosen!");
                break;
            case 2:
                System.out.println("Bow selected!");
                break;
            case 3:
                System.out.println("Staff wielded!");
                break;
            default:
                System.out.println("Invalid choice!");
        }
    }
}