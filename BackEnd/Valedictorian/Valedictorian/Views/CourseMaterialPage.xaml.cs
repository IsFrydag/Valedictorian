namespace Valedictorian.Views;

public partial class CourseMaterialPage : Window
{
	public CourseMaterialPage()
	{
		InitializeComponent();
		Page = new ContentPage()
		{
			Content = new VerticalStackLayout
			{
				Children = {
					new Label { HorizontalOptions = LayoutOptions.Center, VerticalOptions = LayoutOptions.Center, Text = "Welcome to .NET MAUI!"
					}
				}
			}
		};
	}
}