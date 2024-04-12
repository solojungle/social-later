import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type StatusFormFieldProps = {
	form: any;
	fileRef: any;
};

export function MediaFormField({ form, fileRef }: StatusFormFieldProps) {
	return (
		<FormField
			control={form.control}
			name="media"
			render={() => (
				<FormItem>
					<FormControl>
						<Input type="file" {...fileRef} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

//  {form.watch("file") && (
// 								<div className="relative flex items-center justify-center gap-3 p-4">
// 									<FileCheck2Icon className="h-4 w-4" />
// 									<p className="text-sm font-medium">
// 										{form.watch("file")?.name}
// 									</p>
// 								</div>
// 							)} */
// }
//  <ReorderableImageGallery
// 								images={[
// 									{
// 										id: "1",
// 										src: "https://via.placeholder.com/150",
// 										alt: "placeholder",
// 									},
// 									// {
// 									// 	id: "2",
// 									// 	src: "https://via.placeholder.com/150",
// 									// 	alt: "placeholder",
// 									// },
// 									// {
// 									// 	id: "3",
// 									// 	src: "https://via.placeholder.com/150",
// 									// 	alt: "placeholder",
// 									// },
// 								]}
// 							/>
