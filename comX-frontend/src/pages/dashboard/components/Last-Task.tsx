import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";

export default function LastTask() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* No endpoint aggregates completed tasks across all of a user's
              communities yet — this is an honest placeholder rather than
              fabricated task names. */}
          <p className="text-sm text-muted-foreground">
            Activity across your communities will show up here soon.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
