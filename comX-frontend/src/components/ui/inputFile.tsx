import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile() {
  return (
    <div className="grid max-w-sm items-center">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" className="md:w-[106%]"/>
    </div>
  )
}
