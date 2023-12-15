public class PaletteQuest {
    public static String[] palette = {"Color1", "Color2", "Color3", "Color4", "Color5"};

    public static void main(String[] args) {
        palette[2] = "Cerulean Blue";

        for (String color : palette) {
            System.out.println(color);
        }
    }
}
