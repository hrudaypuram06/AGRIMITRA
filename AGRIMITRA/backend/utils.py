import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

def generate_seaborn_bar_base64(labels, values, title, xlabel, ylabel, palette="viridis"):
    plt.figure(figsize=(6, 4))
    sns.set_theme(style="whitegrid")
    ax = sns.barplot(x=labels, y=values, palette=palette)
    plt.title(title, fontsize=14, pad=15)
    plt.xlabel(xlabel, fontsize=12)
    plt.ylabel(ylabel, fontsize=12)
    plt.ylim(0, max(values) * 1.2 if values else 100)
    plt.tight_layout()
    
    # Save to base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png', transparent=True)
    plt.close()
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{img_str}"
